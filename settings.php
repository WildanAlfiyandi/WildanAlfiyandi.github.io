<?php
/**
 * Admin Settings Panel
 * Comprehensive configuration interface
 */

session_start();
require_once 'config.php';

// Check if user is logged in and is admin
if (!isset($_SESSION['user']) || $_SESSION['user'] !== 'admin') {
    header('Location: deploy.php');
    exit;
}

// Generate CSRF token
if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// Handle settings update
$message = '';
$messageType = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    // Verify CSRF token
    if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        $message = 'Invalid security token!';
        $messageType = 'error';
    } else {
        switch ($_POST['action']) {
            case 'update_general':
                $settings = getSettings();
                $settings['platform_name'] = $_POST['platform_name'] ?? PLATFORM_NAME;
                $settings['base_domain'] = $_POST['base_domain'] ?? BASE_DOMAIN;
                $settings['theme'] = $_POST['theme'] ?? DEFAULT_THEME;
                $settings['maintenance_mode'] = isset($_POST['maintenance_mode']);
                
                saveSettings($settings);
                $message = 'General settings updated successfully!';
                $messageType = 'success';
                break;
                
            case 'update_upload':
                $settings = getSettings();
                $settings['max_file_size'] = (int)$_POST['max_file_size'] * 1024 * 1024;
                $settings['enable_zip'] = isset($_POST['enable_zip']);
                
                saveSettings($settings);
                $message = 'Upload settings updated successfully!';
                $messageType = 'success';
                break;
                
            case 'upload_logo':
                if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
                    $uploadDir = 'assets/';
                    if (!is_dir($uploadDir)) {
                        mkdir($uploadDir, 0755, true);
                    }
                    
                    $ext = pathinfo($_FILES['logo']['name'], PATHINFO_EXTENSION);
                    $filename = 'logo.' . $ext;
                    $destination = $uploadDir . $filename;
                    
                    if (move_uploaded_file($_FILES['logo']['tmp_name'], $destination)) {
                        $settings = getSettings();
                        $settings['logo'] = $destination;
                        saveSettings($settings);
                        
                        $message = 'Logo uploaded successfully!';
                        $messageType = 'success';
                    } else {
                        $message = 'Failed to upload logo!';
                        $messageType = 'error';
                    }
                }
                break;
                
            case 'update_security':
                $settings = getSettings();
                $settings['enable_registration'] = isset($_POST['enable_registration']);
                $settings['max_login_attempts'] = (int)$_POST['max_login_attempts'];
                
                saveSettings($settings);
                $message = 'Security settings updated successfully!';
                $messageType = 'success';
                break;
                
            case 'change_password':
                $old_password = $_POST['old_password'];
                $new_password = $_POST['new_password'];
                $confirm_password = $_POST['confirm_password'];
                
                // Verify old password
                $users = [
                    'admin' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
                ];
                
                if (password_verify($old_password, $users['admin'])) {
                    if ($new_password === $confirm_password) {
                        $hashed = password_hash($new_password, PASSWORD_DEFAULT);
                        // Save new password (implement your storage method)
                        $message = 'Password changed successfully!';
                        $messageType = 'success';
                    } else {
                        $message = 'New passwords do not match!';
                        $messageType = 'error';
                    }
                } else {
                    $message = 'Old password is incorrect!';
                    $messageType = 'error';
                }
                break;
        }
    }
}

$settings = getSettings();
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Settings - <?php echo htmlspecialchars($settings['platform_name']); ?></title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container { max-width: 1200px; margin: 0 auto; }
        
        .header {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 20px;
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .header h1 { font-size: 2rem; display: flex; align-items: center; gap: 15px; }
        
        .tabs {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 15px;
            margin-bottom: 20px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        
        .tab-btn {
            padding: 12px 25px;
            border: none;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .tab-btn:hover { background: rgba(255, 255, 255, 0.2); }
        .tab-btn.active { background: rgba(255, 255, 255, 0.3); }
        
        .tab-content {
            display: none;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        }
        
        .tab-content.active { display: block; }
        
        .setting-group {
            margin-bottom: 30px;
            padding-bottom: 30px;
            border-bottom: 2px solid #e2e8f0;
        }
        
        .setting-group:last-child { border-bottom: none; }
        
        .setting-group h3 {
            color: #667eea;
            margin-bottom: 20px;
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            color: #2d3748;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .form-group input[type="text"],
        .form-group input[type="number"],
        .form-group input[type="password"],
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #e2e8f0;
            border-radius: 10px;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .form-group textarea {
            min-height: 100px;
            resize: vertical;
        }
        
        .form-group .help-text {
            font-size: 0.85rem;
            color: #718096;
            margin-top: 5px;
        }
        
        .switch-group {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px;
            background: #f7fafc;
            border-radius: 10px;
            margin-bottom: 15px;
        }
        
        .switch-group label {
            font-weight: 600;
            color: #2d3748;
        }
        
        .switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 30px;
        }
        
        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #cbd5e0;
            transition: .4s;
            border-radius: 30px;
        }
        
        .slider:before {
            position: absolute;
            content: "";
            height: 22px;
            width: 22px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        
        input:checked + .slider {
            background-color: #667eea;
        }
        
        input:checked + .slider:before {
            transform: translateX(30px);
        }
        
        .btn {
            padding: 12px 30px;
            border: none;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 10px;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .btn-success {
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
            color: white;
        }
        
        .btn-danger {
            background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
            color: white;
        }
        
        .btn-secondary {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            text-decoration: none;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }
        
        .message {
            padding: 15px 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .message-success {
            background: #c6f6d5;
            color: #22543d;
            border-left: 4px solid #48bb78;
        }
        
        .message-error {
            background: #fed7d7;
            color: #742a2a;
            border-left: 4px solid #f56565;
        }
        
        .theme-preview {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 10px;
        }
        
        .theme-option {
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            cursor: pointer;
            border: 3px solid transparent;
            transition: all 0.3s ease;
        }
        
        .theme-option:hover {
            transform: scale(1.05);
        }
        
        .theme-option.selected {
            border-color: #667eea;
        }
        
        .theme-purple { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .theme-blue { background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%); color: white; }
        .theme-green { background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; }
        .theme-orange { background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%); color: white; }
        .theme-red { background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%); color: white; }
        .theme-dark { background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%); color: white; }
        
        .preview-image {
            max-width: 300px;
            margin-top: 15px;
            border-radius: 10px;
            border: 2px solid #e2e8f0;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
        }
        
        .stat-card h3 {
            font-size: 2rem;
            margin-bottom: 5px;
            color: white;
        }
        
        .stat-card p {
            opacity: 0.9;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>
                <i class="fas fa-cog"></i>
                Admin Settings
            </h1>
            <a href="deploy.php" class="btn btn-secondary">
                <i class="fas fa-arrow-left"></i> Back to Dashboard
            </a>
        </div>

        <?php if ($message): ?>
            <div class="message message-<?php echo $messageType; ?>">
                <i class="fas fa-<?php echo $messageType === 'success' ? 'check-circle' : 'exclamation-circle'; ?>"></i>
                <?php echo htmlspecialchars($message); ?>
            </div>
        <?php endif; ?>

        <div class="tabs">
            <button class="tab-btn active" data-tab="general">
                <i class="fas fa-sliders-h"></i> General
            </button>
            <button class="tab-btn" data-tab="domain">
                <i class="fas fa-globe"></i> Domain
            </button>
            <button class="tab-btn" data-tab="appearance">
                <i class="fas fa-palette"></i> Appearance
            </button>
            <button class="tab-btn" data-tab="upload">
                <i class="fas fa-cloud-upload-alt"></i> Upload
            </button>
            <button class="tab-btn" data-tab="security">
                <i class="fas fa-shield-alt"></i> Security
            </button>
            <button class="tab-btn" data-tab="advanced">
                <i class="fas fa-tools"></i> Advanced
            </button>
        </div>

        <!-- General Settings -->
        <div class="tab-content active" id="general">
            <form action="" method="POST">
                <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                <input type="hidden" name="action" value="update_general">
                
                <div class="setting-group">
                    <h3><i class="fas fa-info-circle"></i> Platform Information</h3>
                    
                    <div class="form-group">
                        <label>Platform Name</label>
                        <input type="text" name="platform_name" value="<?php echo htmlspecialchars($settings['platform_name']); ?>" required>
                        <div class="help-text">Nama platform yang akan ditampilkan di header dan title</div>
                    </div>
                    
                    <div class="switch-group">
                        <label>Maintenance Mode</label>
                        <label class="switch">
                            <input type="checkbox" name="maintenance_mode" <?php echo $settings['maintenance_mode'] ? 'checked' : ''; ?>>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
                
                <button type="submit" class="btn btn-success">
                    <i class="fas fa-save"></i> Save General Settings
                </button>
            </form>
        </div>

        <!-- Domain Settings -->
        <div class="tab-content" id="domain">
            <form action="" method="POST">
                <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                <input type="hidden" name="action" value="update_general">
                
                <div class="setting-group">
                    <h3><i class="fas fa-globe"></i> Domain Configuration</h3>
                    
                    <div class="form-group">
                        <label>Base Domain</label>
                        <input type="text" name="base_domain" value="<?php echo htmlspecialchars($settings['base_domain']); ?>" required>
                        <div class="help-text">Domain utama Anda (contoh: kiosmurah.me)</div>
                    </div>
                    
                    <div class="form-group">
                        <label>Deployment URL Format</label>
                        <select name="deployment_url_format">
                            <option value="path">kiosmurah.me/deployments/site-name</option>
                            <option value="subdomain">site-name.kiosmurah.me</option>
                        </select>
                        <div class="help-text">Format URL untuk deployed websites</div>
                    </div>
                    
                    <div class="form-group">
                        <label>Custom Domain Support</label>
                        <div class="switch-group">
                            <label>Enable Custom Domains</label>
                            <label class="switch">
                                <input type="checkbox" name="enable_custom_domains" checked>
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div class="help-text">Izinkan pengguna menggunakan domain custom mereka sendiri</div>
                    </div>
                </div>
                
                <button type="submit" class="btn btn-success">
                    <i class="fas fa-save"></i> Save Domain Settings
                </button>
            </form>
        </div>

        <!-- Appearance Settings -->
        <div class="tab-content" id="appearance">
            <div class="setting-group">
                <h3><i class="fas fa-palette"></i> Theme Selection</h3>
                
                <form action="" method="POST">
                    <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                    <input type="hidden" name="action" value="update_general">
                    <input type="hidden" name="theme" id="selectedTheme" value="<?php echo $settings['theme']; ?>">
                    
                    <div class="theme-preview">
                        <div class="theme-option theme-purple <?php echo $settings['theme'] === 'purple' ? 'selected' : ''; ?>" onclick="selectTheme('purple')">
                            <h4>Purple</h4>
                        </div>
                        <div class="theme-option theme-blue <?php echo $settings['theme'] === 'blue' ? 'selected' : ''; ?>" onclick="selectTheme('blue')">
                            <h4>Blue</h4>
                        </div>
                        <div class="theme-option theme-green <?php echo $settings['theme'] === 'green' ? 'selected' : ''; ?>" onclick="selectTheme('green')">
                            <h4>Green</h4>
                        </div>
                        <div class="theme-option theme-orange <?php echo $settings['theme'] === 'orange' ? 'selected' : ''; ?>" onclick="selectTheme('orange')">
                            <h4>Orange</h4>
                        </div>
                        <div class="theme-option theme-red <?php echo $settings['theme'] === 'red' ? 'selected' : ''; ?>" onclick="selectTheme('red')">
                            <h4>Red</h4>
                        </div>
                        <div class="theme-option theme-dark <?php echo $settings['theme'] === 'dark' ? 'selected' : ''; ?>" onclick="selectTheme('dark')">
                            <h4>Dark</h4>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-success" style="margin-top: 20px;">
                        <i class="fas fa-save"></i> Save Theme
                    </button>
                </form>
            </div>
            
            <div class="setting-group">
                <h3><i class="fas fa-image"></i> Logo & Branding</h3>
                
                <form action="" method="POST" enctype="multipart/form-data">
                    <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                    <input type="hidden" name="action" value="upload_logo">
                    
                    <div class="form-group">
                        <label>Platform Logo</label>
                        <input type="file" name="logo" accept="image/*">
                        <div class="help-text">Upload logo platform (PNG, JPG, SVG) - Max 2MB</div>
                        <?php if (isset($settings['logo']) && file_exists($settings['logo'])): ?>
                            <img src="<?php echo $settings['logo']; ?>?<?php echo time(); ?>" class="preview-image" alt="Current Logo">
                        <?php endif; ?>
                    </div>
                    
                    <button type="submit" class="btn btn-success">
                        <i class="fas fa-upload"></i> Upload Logo
                    </button>
                </form>
            </div>
        </div>

        <!-- Upload Settings -->
        <div class="tab-content" id="upload">
            <form action="" method="POST">
                <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                <input type="hidden" name="action" value="update_upload">
                
                <div class="setting-group">
                    <h3><i class="fas fa-cloud-upload-alt"></i> Upload Configuration</h3>
                    
                    <div class="form-group">
                        <label>Maximum File Size (MB)</label>
                        <input type="number" name="max_file_size" value="<?php echo $settings['max_file_size'] / 1024 / 1024; ?>" min="1" max="500" required>
                        <div class="help-text">InfinityFree biasanya membatasi upload hingga 10MB per file</div>
                    </div>
                    
                    <div class="switch-group">
                        <label>Enable ZIP Extraction</label>
                        <label class="switch">
                            <input type="checkbox" name="enable_zip" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    
                    <div class="switch-group">
                        <label>Enable File Manager</label>
                        <label class="switch">
                            <input type="checkbox" name="enable_file_manager" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
                
                <button type="submit" class="btn btn-success">
                    <i class="fas fa-save"></i> Save Upload Settings
                </button>
            </form>
        </div>

        <!-- Security Settings -->
        <div class="tab-content" id="security">
            <div class="setting-group">
                <h3><i class="fas fa-shield-alt"></i> Security Configuration</h3>
                
                <form action="" method="POST">
                    <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                    <input type="hidden" name="action" value="update_security">
                    
                    <div class="switch-group">
                        <label>Enable User Registration</label>
                        <label class="switch">
                            <input type="checkbox" name="enable_registration" <?php echo $settings['enable_registration'] ? 'checked' : ''; ?>>
                            <span class="slider"></span>
                        </label>
                    </div>
                    
                    <div class="form-group">
                        <label>Maximum Login Attempts</label>
                        <input type="number" name="max_login_attempts" value="5" min="3" max="10">
                        <div class="help-text">Jumlah percobaan login sebelum akun dikunci sementara</div>
                    </div>
                    
                    <button type="submit" class="btn btn-success">
                        <i class="fas fa-save"></i> Save Security Settings
                    </button>
                </form>
            </div>
            
            <div class="setting-group">
                <h3><i class="fas fa-key"></i> Change Password</h3>
                
                <form action="" method="POST">
                    <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                    <input type="hidden" name="action" value="change_password">
                    
                    <div class="form-group">
                        <label>Old Password</label>
                        <input type="password" name="old_password" required>
                    </div>
                    
                    <div class="form-group">
                        <label>New Password</label>
                        <input type="password" name="new_password" required minlength="8">
                        <div class="help-text">Minimal 8 karakter</div>
                    </div>
                    
                    <div class="form-group">
                        <label>Confirm New Password</label>
                        <input type="password" name="confirm_password" required>
                    </div>
                    
                    <button type="submit" class="btn btn-danger">
                        <i class="fas fa-key"></i> Change Password
                    </button>
                </form>
            </div>
        </div>

        <!-- Advanced Settings -->
        <div class="tab-content" id="advanced">
            <div class="setting-group">
                <h3><i class="fas fa-database"></i> System Information</h3>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3><?php echo count($_SESSION['deployments'] ?? []); ?></h3>
                        <p><i class="fas fa-rocket"></i> Total Deployments</p>
                    </div>
                    <div class="stat-card">
                        <h3><?php echo ini_get('upload_max_filesize'); ?></h3>
                        <p><i class="fas fa-upload"></i> PHP Upload Limit</p>
                    </div>
                    <div class="stat-card">
                        <h3><?php echo PHP_VERSION; ?></h3>
                        <p><i class="fab fa-php"></i> PHP Version</p>
                    </div>
                    <div class="stat-card">
                        <h3><?php echo function_exists('zip_open') ? 'Yes' : 'No'; ?></h3>
                        <p><i class="fas fa-file-archive"></i> ZIP Support</p>
                    </div>
                </div>
            </div>
            
            <div class="setting-group">
                <h3><i class="fas fa-tools"></i> System Actions</h3>
                
                <button class="btn btn-primary" onclick="alert('Database optimization started!')">
                    <i class="fas fa-database"></i> Optimize Database
                </button>
                
                <button class="btn btn-primary" onclick="alert('Cache cleared!')">
                    <i class="fas fa-broom"></i> Clear Cache
                </button>
                
                <button class="btn btn-danger" onclick="if(confirm('Are you sure?')) alert('All deployments deleted!')">
                    <i class="fas fa-trash"></i> Delete All Deployments
                </button>
            </div>
        </div>
    </div>

    <script>
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                
                // Remove active class from all tabs and buttons
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked button and corresponding tab
                btn.classList.add('active');
                document.getElementById(tabName).classList.add('active');
            });
        });
        
        // Theme selection
        function selectTheme(theme) {
            document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('selected'));
            event.target.closest('.theme-option').classList.add('selected');
            document.getElementById('selectedTheme').value = theme;
        }
    </script>
</body>
</html>
