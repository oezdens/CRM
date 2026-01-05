<?php
/**
 * Example email config.
 *
 * IMPORTANT: Copy this file outside the webroot and fill in your real SMTP password.
 * Example placement (Windows):
 *  C:\Users\youruser\email_config.php
 * Then send-email.php will attempt to include one level above the project root.
 */

return [
    // SMTP settings (Strato example)
    'smtp_host' => 'smtp.strato.de',
    'smtp_port' => 587,
    'smtp_secure' => 'ssl', // or 'ssl'
    'smtp_user' => 'kontakt@oezdens.com',
    'smtp_pass' => 'YOUR_SMTP_PASSWORD', // <-- DO NOT COMMIT REAL PASSWORD

    // From / To
    'from_email' => 'kontakt@oezdens.com',
    'from_name' => 'oezdensweb',
    'from_name' => 'oezdens',
    'to_email' => 'kontakt@oezdens.com',
];
