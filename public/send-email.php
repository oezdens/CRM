<?php
/**
 * send-email.php
 * Simple endpoint to send contact form emails.
 *
 * Notes:
 * - Place your real config outside the webroot, e.g. one level above this project
 *   in a file named `email_config.php` that returns an array (see example in repo).
 * - If PHPMailer is available (via Composer autoload), this script will use SMTP.
 *   Otherwise it falls back to PHP's `mail()` function.
 */

header('Content-Type: application/json; charset=utf-8');

$config = null;
$attempt = [];
// Build a list of candidate paths: current dir and up to 4 parent levels
$dir = __DIR__;
for ($i = 0; $i < 5; $i++) {
    $attempt[] = $dir . '/email_config.php';
    $dir = dirname($dir);
}
// keep the original example fallback
$attempt[] = __DIR__ . '/../send-email-config.example.php';

foreach ($attempt as $p) {
    if (file_exists($p)) {
        $c = include $p;
        if (is_array($c)) { $config = $c; break; }
    }
}

if (!$config) {
    http_response_code(500);
    // helpful debug: list tried paths so you can see where the script looked
    echo json_encode([
        'success' => false,
        'message' => 'Email configuration not found. Please create email_config.php outside webroot.',
        'paths_tested' => $attempt,
    ]);
    exit;
}

// read POST
$data = json_decode(file_get_contents('php://input'), true) ?: $_POST;

// simple sanitization/validation
$name = isset($data['name']) ? trim($data['name']) : '';
$email = isset($data['email']) ? trim($data['email']) : '';
$subject = isset($data['subject']) ? trim($data['subject']) : '';
$message = isset($data['message']) ? trim($data['message']) : '';

if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL) || !$message) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Bitte geben Sie eine gültige E-Mail und eine Nachricht an.']);
    exit;
}

$subjectLine = '[Kontaktformular] ' . ($subject ?: 'Neue Nachricht');

// Admin recipient(s): primary recipient from config and explicit admin copy
// Admin recipient: prefer explicit admin address for notifications
// We want admin notifications to go to the operator address rather than the site contact.
// If you prefer a different address, update `to_email` in `email_config.php`.
$adminPrimary = 'oezdens.web@outlook.de';
$adminCopy = $config['to_email'] ?? $config['from_email'];

$bodyHtml = "<h2>Neue Nachricht über das Kontaktformular</h2>" .
    "<p><strong>Name:</strong> " . htmlspecialchars($name) . "</p>" .
    "<p><strong>E-Mail:</strong> " . htmlspecialchars($email) . "</p>" .
    "<p><strong>Betreff:</strong> " . htmlspecialchars($subject) . "</p>" .
    "<hr/>" .
    "<div>" . nl2br(htmlspecialchars($message)) . "</div>";

// Friendly HTML confirmation to the user
$userHtml = '<div style="font-family:Inter,Arial,Helvetica,sans-serif;color:#0f172a">'
    . '<div style="max-width:680px;margin:0 auto;padding:24px;background:#ffffff;border-radius:8px;border:1px solid #e6e9ef">'
    . "<h2 style=\"color:#111827;\">Danke für Ihre Nachricht</h2>"
    . "<p style=\"color:#374151;\">Hallo " . htmlspecialchars($name) . ",</p>"
    . "<p style=\"color:#374151;\">vielen Dank für Ihre Nachricht. Wir haben Ihre Anfrage erhalten und melden uns schnellstmöglich bei Ihnen.</p>"
    . "<h3 style=\"color:#111827;\">Ihre Nachricht</h3>"
    . "<div style=\"background:#f8fafc;padding:12px;border-radius:6px;color:#374151\">" . nl2br(htmlspecialchars($message)) . "</div>"
    . "<p style=\"color:#374151;\">Mit freundlichen Grüßen<br/>oezdens</p>"
    . "<hr style=\"border:none;border-top:1px solid #eef2f6;margin:12px 0;\">"
    . "<p style=\"color:#6b7280;font-size:12px;\">Diese E-Mail ist eine automatische Bestätigung. Bitte antworte nicht auf diese Nachricht, sondern nutze die angegebenen Kontaktdaten.</p>"
    . '</div></div>';

// Try to use PHPMailer if available
// Attempt to include Composer autoload if present (so PHPMailer class becomes available)
$autoloadCandidates = [
    __DIR__ . '/../vendor/autoload.php',
    __DIR__ . '/vendor/autoload.php',
    __DIR__ . '/../../vendor/autoload.php',
];
foreach ($autoloadCandidates as $a) {
    if (file_exists($a)) { require_once $a; break; }
}

// Minimal SMTP client using AUTH LOGIN — used when PHPMailer isn't available
function smtp_send($host, $port, $secure, $user, $pass, $from, $toRecipients, $dataMsg, &$log = []) {
    $log = [];
    $contextOptions = [];
    $errno = 0; $errstr = '';
    $remote = $host . ':' . $port;
    $log[] = "connect:$remote";
    $socket = stream_socket_client($remote, $errno, $errstr, 30, STREAM_CLIENT_CONNECT);
    if (!$socket) { $log[] = "connect_failed: $errno $errstr"; return false; }
    stream_set_timeout($socket, 30);
    $read = function() use ($socket, &$log) { $res = ''; while (($line = fgets($socket, 515)) !== false) { $res .= $line; if (substr($line,3,1) === ' ') break; } $log[] = trim($res); return $res; };
    $write = function($cmd) use ($socket, &$log) { fwrite($socket, $cmd . "\r\n"); $log[] = "C: $cmd"; };

    $greeting = $read();
    if (stripos($greeting, '220') !== 0) { fclose($socket); $log[] = 'greeting_failed'; return false; }

    $hostname = $_SERVER['SERVER_NAME'] ?? 'localhost';
    $write("EHLO $hostname");
    $ehlo = $read();

    // STARTTLS if requested and server supports it
    if (strtolower($secure) === 'tls' && stripos($ehlo, 'STARTTLS') !== false) {
        $write('STARTTLS');
        $resp = $read();
        if (stripos($resp, '220') === 0) {
            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                $log[] = 'starttls_failed'; fclose($socket); return false;
            }
            // re-ehlo
            $write("EHLO $hostname");
            $read();
        }
    }

    // AUTH LOGIN if username provided
    if ($user) {
        $write('AUTH LOGIN');
        $r = $read();
        if (stripos($r,'334') !== 0) { $log[] = 'auth_not_supported'; fclose($socket); return false; }
        $write(base64_encode($user)); $read();
        $write(base64_encode($pass)); $r2 = $read();
        if (stripos($r2,'235') !== 0) { $log[] = 'auth_failed'; fclose($socket); return false; }
    }

    // MAIL FROM
    $write('MAIL FROM:<' . $from . '>'); $r = $read(); if (stripos($r,'250') !== 0) { $log[]='mailfrom_failed'; fclose($socket); return false; }

    // RCPT TO for each recipient
    foreach ((array)$toRecipients as $rcpt) {
        $write('RCPT TO:<' . $rcpt . '>'); $r = $read(); if (stripos($r,'250') !== 0 && stripos($r,'251') !== 0) { $log[] = 'rcpt_failed:'.$rcpt; fclose($socket); return false; }
    }

    // DATA
    $write('DATA'); $r = $read(); if (stripos($r,'354') !== 0) { $log[] = 'data_not_accepted'; fclose($socket); return false; }

    // send message raw
    fwrite($socket, $dataMsg . "\r\n.\r\n"); $log[] = 'C: <DATA_BODY_SENT>'; $r = $read(); if (stripos($r,'250') !== 0) { $log[]='data_send_failed'; fclose($socket); return false; }

    $write('QUIT'); $read(); fclose($socket);
    $log[] = 'smtp_ok';
    return true;
}

if (class_exists('\PHPMailer\PHPMailer\PHPMailer')) {
    try {
        $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = $config['smtp_host'] ?? '';
        $mail->SMTPAuth = !empty($config['smtp_user']);
        if (!empty($config['smtp_user'])) {
            $mail->Username = $config['smtp_user'];
            $mail->Password = $config['smtp_pass'];
        }
        $mail->SMTPSecure = $config['smtp_secure'] ?? (isset($config['smtp_port']) && $config['smtp_port']==465 ? 'ssl' : 'tls');
        $mail->Port = $config['smtp_port'] ?? 587;

        // Send admin email (to configured admin and explicit copy)
        $mail->setFrom($config['from_email'], $config['from_name'] ?? '');
        $mail->clearAddresses();
        // Admin notifications go only to the operator address
        $mail->addAddress($adminPrimary);
        // For admin email, set Reply-To to the customer's email so replies go directly to them.
        $customerEmail = $email;
        $customerName = $name ?: '';
        $mail->clearReplyTos();
        $mail->addReplyTo($customerEmail, $customerName);

        $mail->isHTML(true);
        $mail->Subject = $subjectLine;
        $mail->Body = $bodyHtml;
        $mail->AltBody = strip_tags(str_replace(['<br/>','<br>','<br />'],'\n',$bodyHtml));
        $mail->send();

        // Send confirmation to the user
        $mail->clearAddresses();
        $mail->addAddress($email, $name ?: '');
        $mail->Subject = 'Bestätigung: Wir haben Ihre Nachricht erhalten';
        $mail->Body = $userHtml;
        $mail->AltBody = 'Danke für Ihre Nachricht. Wir melden uns schnellstmöglich.';
        $mail->send();

        echo json_encode(['success'=>true, 'message'=>'Nachricht gesendet und Bestätigung verschickt.']);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success'=>false, 'message'=>'Fehler beim Senden: '.$e->getMessage()]);
        exit;
    }
}

// If PHPMailer not available but SMTP config is present, try our minimal SMTP client (AUTH LOGIN)
if (!class_exists('\PHPMailer\PHPMailer\PHPMailer') && !empty($config['smtp_host'])) {
    $debug = !empty($data['debug']) || !empty($_GET['debug']);
    $smtp_log = [];

    // prepare headers + multipart body (recreate same as mail() fallback)
    // For admin email we want Reply-To to point to the customer so the admin can reply directly
    $replyToAddr = $email;
    $boundary = '=_'.md5(uniqid((string) microtime(true), true));
    $bodyPlain = "Neue Nachricht über das Kontaktformular\n\n" .
        "Name: " . $name . "\n" .
        "E-Mail: " . $email . "\n" .
        "Betreff: " . ($subject ?: '-') . "\n\n" .
        strip_tags($message) . "\n";

    $multipart = "--" . $boundary . "\r\n";
    $multipart .= "Content-Type: text/plain; charset=utf-8\r\n\r\n";
    $multipart .= $bodyPlain . "\r\n";
    $multipart .= "--" . $boundary . "\r\n";
    $multipart .= "Content-Type: text/html; charset=utf-8\r\n\r\n";
    $multipart .= $bodyHtml . "\r\n";
    $multipart .= "--" . $boundary . "--\r\n";

    $fromHeader = ($config['from_name'] ?? '') ? ($config['from_name'] . ' <' . $config['from_email'] . '>') : $config['from_email'];
    $headersRaw = '';
    $headersRaw .= 'From: ' . $fromHeader . "\r\n";
    $headersRaw .= 'Reply-To: ' . $replyToAddr . "\r\n";
    $headersRaw .= 'Subject: ' . $subjectLine . "\r\n";
    $headersRaw .= 'Date: ' . gmdate('D, d M Y H:i:s') . ' +0000' . "\r\n";
    $headersRaw .= 'Message-ID: <' . md5(uniqid((string) microtime(true), true)) . '@' . ($_SERVER['SERVER_NAME'] ?? 'localhost') . '>' . "\r\n";
    $headersRaw .= 'X-Mailer: PHP/' . phpversion() . "\r\n";
    $headersRaw .= 'MIME-Version: 1.0' . "\r\n";
    $headersRaw .= 'Content-Type: multipart/alternative; boundary="' . $boundary . '"' . "\r\n\r\n";

    $rawMessage = $headersRaw . $multipart;

    // recipients for admin: only the operator address
    $recipients = [$adminPrimary];

    $smtpOk = smtp_send($config['smtp_host'], $config['smtp_port'] ?? 587, $config['smtp_secure'] ?? 'tls', $config['smtp_user'] ?? null, $config['smtp_pass'] ?? null, $config['from_email'], $recipients, $rawMessage, $smtp_log);

    if ($smtpOk) {
        // send user confirmation via SMTP as well
        $userHeaders = '';
        $userHeaders .= 'From: ' . $fromHeader . "\r\n";
        $userHeaders .= 'Reply-To: ' . ($config['from_email']) . "\r\n";
        $userHeaders .= 'Subject: Bestätigung: Wir haben Ihre Nachricht erhalten' . "\r\n";
        $userHeaders .= 'MIME-Version: 1.0' . "\r\n";
        $userHeaders .= 'Content-Type: multipart/alternative; boundary="' . $boundary . '"' . "\r\n\r\n";
        $userPlain = "Hallo " . ($name ?: '') . ",\n\n" . "vielen Dank für Ihre Nachricht.\n\n" . strip_tags($message) . "\n";
        $multipartUser = "--" . $boundary . "\r\n";
        $multipartUser .= "Content-Type: text/plain; charset=utf-8\r\n\r\n";
        $multipartUser .= $userPlain . "\r\n";
        $multipartUser .= "--" . $boundary . "\r\n";
        $multipartUser .= "Content-Type: text/html; charset=utf-8\r\n\r\n";
        $multipartUser .= $userHtml . "\r\n";
        $multipartUser .= "--" . $boundary . "--\r\n";

        $smtp_log_user = [];
        smtp_send($config['smtp_host'], $config['smtp_port'] ?? 587, $config['smtp_secure'] ?? 'tls', $config['smtp_user'] ?? null, $config['smtp_pass'] ?? null, $config['from_email'], [$email], $userHeaders . $multipartUser, $smtp_log_user);

        $out = ['success'=>true, 'message'=>'Nachricht gesendet (SMTP).', 'smtp_log'=>$smtp_log];
        if ($debug) $out['smtp_log_user'] = $smtp_log_user;
        echo json_encode($out);
        exit;
    } else {
        if ($debug) echo json_encode(['success'=>false,'message'=>'SMTP send failed','smtp_log'=>$smtp_log]); else { http_response_code(500); echo json_encode(['success'=>false,'message'=>'Mail an Admin konnte nicht gesendet werden (SMTP).']); }
        exit;
    }
}

// Fallback to mail()
    // prepare reply-to and sender
    // For admin messages, set Reply-To to the customer's email so admin replies go to customer
    $replyToAddr = $email;
    $replyToName = $config['reply_to_name'] ?? 'oezdens';

    $headersAdmin = [];
    $headersAdmin[] = 'From: ' . ($config['from_name'] ?? '') . ' <' . $config['from_email'] . '>';
    $headersAdmin[] = 'Reply-To: ' . $replyToAddr;
    $headersAdmin[] = 'Sender: ' . $config['from_email'];

// add standard headers to improve deliverability
$headersAdmin[] = 'Date: ' . gmdate('D, d M Y H:i:s') . ' +0000';
$headersAdmin[] = 'Message-ID: <' . md5(uniqid((string) microtime(true), true)) . '@' . ($_SERVER['SERVER_NAME'] ?? 'localhost') . '>';
$headersAdmin[] = 'X-Mailer: PHP/' . phpversion();

// build a multipart/alternative body (plain + html) to reduce spam classification
$boundary = '=_'.md5(uniqid((string) microtime(true), true));
$headersAdmin[] = 'MIME-Version: 1.0';
$headersAdmin[] = 'Content-Type: multipart/alternative; boundary="' . $boundary . '"';

$bodyPlain = "Neue Nachricht über das Kontaktformular\n\n" .
    "Name: " . $name . "\n" .
    "E-Mail: " . $email . "\n" .
    "Betreff: " . ($subject ?: '-') . "\n\n" .
    strip_tags($message) . "\n";

$multipart = "--" . $boundary . "\r\n";
$multipart .= "Content-Type: text/plain; charset=utf-8\r\n\r\n";
$multipart .= $bodyPlain . "\r\n";
$multipart .= "--" . $boundary . "\r\n";
$multipart .= "Content-Type: text/html; charset=utf-8\r\n\r\n";
$multipart .= $bodyHtml . "\r\n";
$multipart .= "--" . $boundary . "--\r\n";

// try to set envelope sender (Return-Path) to the configured from-address
$sendmail_param = isset($config['from_email']) && $config['from_email'] ? '-f' . $config['from_email'] : null;

if ($sendmail_param) {
    $adminOk = mail($adminPrimary, $subjectLine, $multipart, implode("\r\n", $headersAdmin), $sendmail_param);
} else {
    $adminOk = mail($adminPrimary, $subjectLine, $multipart, implode("\r\n", $headersAdmin));
}
// no explicit copy to contact address: admin notifications go only to operator

if ($adminOk) {
    $headersUser = [];
    $headersUser[] = 'From: ' . ($config['from_name'] ?? '') . ' <' . $config['from_email'] . '>';
    $headersUser[] = 'Reply-To: ' . $config['from_email'];
    $headersUser[] = 'Date: ' . gmdate('D, d M Y H:i:s') . ' +0000';
    $headersUser[] = 'Message-ID: <' . md5(uniqid((string) microtime(true), true)) . '@' . ($_SERVER['SERVER_NAME'] ?? 'localhost') . '>';
    $headersUser[] = 'X-Mailer: PHP/' . phpversion();
    $headersUser[] = 'MIME-Version: 1.0';
    $headersUser[] = 'Content-Type: multipart/alternative; boundary="' . $boundary . '"';

    $userPlain = "Hallo " . ($name ?: '') . ",\n\n" . "vielen Dank für Ihre Nachricht.\n\n" . strip_tags($message) . "\n";

    $multipartUser = "--" . $boundary . "\r\n";
    $multipartUser .= "Content-Type: text/plain; charset=utf-8\r\n\r\n";
    $multipartUser .= $userPlain . "\r\n";
    $multipartUser .= "--" . $boundary . "\r\n";
    $multipartUser .= "Content-Type: text/html; charset=utf-8\r\n\r\n";
    $multipartUser .= $userHtml . "\r\n";
    $multipartUser .= "--" . $boundary . "--\r\n";

    if ($sendmail_param) {
        $userOk = mail($email, 'Bestätigung: Wir haben Ihre Nachricht erhalten', $multipartUser, implode("\r\n", $headersUser), $sendmail_param);
    } else {
        $userOk = mail($email, 'Bestätigung: Wir haben Ihre Nachricht erhalten', $multipartUser, implode("\r\n", $headersUser));
    }
    if ($userOk) {
        echo json_encode(['success'=>true, 'message'=>'Nachricht gesendet und Bestätigung verschickt.']);
    } else {
        http_response_code(500);
        echo json_encode(['success'=>false, 'message'=>'Nachricht gesendet, Bestätigungs-E-Mail an Nutzer fehlgeschlagen.']);
    }
} else {
    http_response_code(500);
    echo json_encode(['success'=>false, 'message'=>'Mail an Admin konnte nicht gesendet werden.']);
}

