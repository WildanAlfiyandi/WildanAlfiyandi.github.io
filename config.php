<?php
/**
 * Configuration File for Professional Deployment Platform
 * Supports InfinityFree hosting and custom domains
 */

// Database Configuration (for persistent storage)
// For InfinityFree, use their MySQL database
define('DB_HOST', 'localhost'); // Change to your InfinityFree MySQL host
define('DB_USER', 'your_db_user'); // Change to your database username
define('DB_PASS', 'your_db_pass'); // Change to your database password
define('DB_NAME', 'your_db_name'); // Change to your database name

// Platform Configuration
define('PLATFORM_NAME', 'Deployment Platform');
define('PLATFORM_LOGO', 'assets/logo.png'); // Path to platform logo
define('PLATFORM_FAVICON', 'assets/favicon.ico');

// Domain Configuration
define('BASE_DOMAIN', 'deploy.wuaze.com'); // Your main domain
define('USE_SUBDOMAIN', false); // Set to true for subdomain deployments (deploy.kiosmurah.me)
define('DEPLOYMENT_URL_PREFIX', '/deployments/'); // URL prefix for deployments

// Directory Configuration
define('DEPLOYMENTS_DIR', __DIR__ . '/deployments/');
define('ASSETS_DIR', __DIR__ . '/assets/');
define('BACKUP_DIR', __DIR__ . '/backups/');

// Upload Configuration
define('MAX_FILE_SIZE', 50 * 1024 * 1024); // 50MB (adjust for InfinityFree limits)
define('MAX_DEPLOYMENT_SIZE', 200 * 1024 * 1024); // 200MB total per deployment
define('ALLOWED_EXTENSIONS', [
    'html', 'htm', 'css', 'js', 'php', 'json', 'xml', 'txt', 'md',
    'jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ico', 'bmp',
    'woff', 'woff2', 'ttf', 'eot', 'otf',
    'pdf', 'zip', 'rar', '7z', 'tar', 'gz',
    'mp4', 'webm', 'mp3', 'wav', 'ogg',
    'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'
]);

// Security Configuration
define('ENABLE_REGISTRATION', false); // Set to true to allow user registration
define('REQUIRE_EMAIL_VERIFICATION', false);
define('MAX_LOGIN_ATTEMPTS', 5);
define('LOGIN_TIMEOUT', 300); // 5 minutes

// Session Configuration
define('SESSION_LIFETIME', 3600 * 24); // 24 hours
define('SESSION_NAME', 'KIOSMURAH_DEPLOY');

// Theme Configuration
define('DEFAULT_THEME', 'purple'); // purple, blue, green, orange, red, dark
define('ENABLE_THEME_SWITCHER', true);
define('ENABLE_DARK_MODE', true);

// Feature Flags
define('ENABLE_ZIP_EXTRACTION', true);
define('ENABLE_FILE_MANAGER', true);
define('ENABLE_BACKUP', true);
define('ENABLE_ANALYTICS', true);
define('ENABLE_API', true);
define('ENABLE_CUSTOM_DOMAINS', true);

// Analytics Configuration
define('GOOGLE_ANALYTICS_ID', ''); // Your GA tracking ID
define('TRACK_DEPLOYMENTS', true);
define('TRACK_UPLOADS', true);

// Email Configuration (for notifications)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', '');
define('SMTP_PASS', '');
define('SMTP_FROM', 'noreply@kiosmurah.me');
define('SMTP_FROM_NAME', 'Kios Murah Deployment');

// Notification Settings
define('NOTIFY_NEW_DEPLOYMENT', false);
define('NOTIFY_FAILED_UPLOAD', false);
define('NOTIFY_DISK_QUOTA', true);

// Maintenance Mode
define('MAINTENANCE_MODE', false);
define('MAINTENANCE_MESSAGE', 'Platform sedang dalam pemeliharaan. Silakan coba lagi nanti.');

// API Configuration
define('API_ENABLED', true);
define('API_KEY_REQUIRED', true);
define('API_RATE_LIMIT', 100); // requests per hour

// Backup Configuration
define('AUTO_BACKUP', true);
define('BACKUP_RETENTION_DAYS', 30);
define('BACKUP_SCHEDULE', 'daily'); // daily, weekly, monthly

// InfinityFree Specific Settings
define('INFINITYFREE_MODE', true); // Enable InfinityFree compatibility
define('USE_HTACCESS_PROTECTION', true);
define('DISABLE_EXEC_FUNCTIONS', true); // InfinityFree disables exec functions

// Custom Headers
$customHeaders = [
    'X-Frame-Options' => 'SAMEORIGIN',
    'X-Content-Type-Options' => 'nosniff',
    'X-XSS-Protection' => '1; mode=block',
    'Referrer-Policy' => 'strict-origin-when-cross-origin'
];

// Load custom configuration if exists
if (file_exists(__DIR__ . '/config.custom.php')) {
    require_once __DIR__ . '/config.custom.php';
}

// Initialize settings from database or session
function getSettings() {
    // Try to load from database first
    if (defined('DB_HOST') && DB_HOST !== 'localhost') {
        try {
            $pdo = new PDO(
                'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME,
                DB_USER,
                DB_PASS,
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
            );
            
            $stmt = $pdo->query('SELECT * FROM settings LIMIT 1');
            $settings = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($settings) {
                return $settings;
            }
        } catch (PDOException $e) {
            // Database not available, use session storage
        }
    }
    
    // Fallback to session storage
    if (!isset($_SESSION['settings'])) {
        $_SESSION['settings'] = [
            'platform_name' => PLATFORM_NAME,
            'base_domain' => BASE_DOMAIN,
            'theme' => DEFAULT_THEME,
            'logo' => PLATFORM_LOGO,
            'max_file_size' => MAX_FILE_SIZE,
            'enable_registration' => ENABLE_REGISTRATION,
            'maintenance_mode' => MAINTENANCE_MODE
        ];
    }
    
    return $_SESSION['settings'];
}

// Save settings
function saveSettings($settings) {
    // Try to save to database first
    if (defined('DB_HOST') && DB_HOST !== 'localhost') {
        try {
            $pdo = new PDO(
                'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME,
                DB_USER,
                DB_PASS,
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
            );
            
            // Update or insert settings
            $stmt = $pdo->prepare('
                INSERT INTO settings (platform_name, base_domain, theme, logo, max_file_size, enable_registration, maintenance_mode, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
                ON DUPLICATE KEY UPDATE
                    platform_name = VALUES(platform_name),
                    base_domain = VALUES(base_domain),
                    theme = VALUES(theme),
                    logo = VALUES(logo),
                    max_file_size = VALUES(max_file_size),
                    enable_registration = VALUES(enable_registration),
                    maintenance_mode = VALUES(maintenance_mode),
                    updated_at = NOW()
            ');
            
            $stmt->execute([
                $settings['platform_name'],
                $settings['base_domain'],
                $settings['theme'],
                $settings['logo'],
                $settings['max_file_size'],
                $settings['enable_registration'] ? 1 : 0,
                $settings['maintenance_mode'] ? 1 : 0
            ]);
            
            return true;
        } catch (PDOException $e) {
            // Database not available, use session storage
        }
    }
    
    // Fallback to session storage
    $_SESSION['settings'] = $settings;
    return true;
}

return [
    'platform_name' => PLATFORM_NAME,
    'base_domain' => BASE_DOMAIN,
    'deployment_url_prefix' => DEPLOYMENT_URL_PREFIX,
    'theme' => DEFAULT_THEME,
    'max_file_size' => MAX_FILE_SIZE,
    'allowed_extensions' => ALLOWED_EXTENSIONS
];
?>
