<?php
/**
 * email_config.php
 *
 * WICHTIG: Diese Datei enthält sensible Zugangsdaten. Bitte
 * - Ersetze die Platzhalter unten durch deine echten SMTP-Zugangsdaten,
 * - Verschiebe die Datei danach außerhalb des öffentlichen Webroots/FTP (z. B. ein Verzeichnis oberhalb des Projekts),
 * - Und füge die Datei niemals in ein Git-Repository oder sonst irgendwo hoch, wo Dritte Zugriff haben.
 *
 * Beispiel: verschiebe nach `C:\Users\<dein-user>\email_config.php` oder ein Verzeichnis, das nicht per FTP erreichbar ist.
 */
return [
    'smtp_host' => 'smtp.strato.de',
    'smtp_port' => 587,
    'smtp_secure' => 'tls',
    'smtp_user' => 'kontakt@oezdens.com',
    'smtp_pass' => 'oezdensweb12345',
    'from_email' => 'kontakt@oezdens.com',
    'from_name' => 'oezdenweb - Website',
    'to_email' => 'kontakt@oezdens.com',
    'reply_to' => 'oezdens.web@outlook.de',
    'reply_to_name' => 'oezdens',
];