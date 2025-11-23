<?php
/**
 * Professional Website Deployment Platform
 * Main Deployment Interface
 */

session_start();

// Load configuration
if (file_exists(__DIR__ . '/config.php')) {
    require_once __DIR__ . '/config.php';
    $settings = getSettings();
} else {
    // Fallback configuration
    define('DEPLOYMENTS_DIR', __DIR__ . '/deployments/');
    define('MAX_FILE_SIZE', 50 * 1024 * 1024); // 50MB
    define('ALLOWED_EXTENSIONS', ['html', 'htm', 'css', 'js', 'php', 'json', 'xml', 'txt', 'md', 
                                  'jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ico', 
                                  'woff', 'woff2', 'ttf', 'eot', 'otf',
                                  'pdf', 'zip', 'rar', '7z']);
    $settings = [
        'platform_name' => 'Professional Deployment Platform',
        'base_domain' => 'localhost',
        'theme' => 'purple'
    ];
}

// Create deployments directory if not exists
if (!file_exists(DEPLOYMENTS_DIR)) {
    mkdir(DEPLOYMENTS_DIR, 0755, true);
}

// Initialize session data
if (!isset($_SESSION['deployments'])) {
    $_SESSION['deployments'] = [];
}

// Check if user is logged in
$isLoggedIn = isset($_SESSION['user']);
$username = $_SESSION['user'] ?? 'Guest';
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($settings['platform_name'] ?? 'Professional Deployment Platform'); ?></title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: #667eea;
            --secondary: #764ba2;
            --success: #48bb78;
            --danger: #f56565;
            --warning: #ed8936;
            --info: #4299e1;
            --dark: #1a202c;
            --light: #f7fafc;
            --glass-bg: rgba(255, 255, 255, 0.1);
            --glass-border: rgba(255, 255, 255, 0.2);
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            position: relative;
            overflow-x: hidden;
        }

        /* Animated Background */
        .animated-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            overflow: hidden;
            pointer-events: none;
        }

        .particle {
            position: absolute;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            animation: float 15s infinite ease-in-out;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
            25% { transform: translateY(-50px) translateX(30px) rotate(90deg); }
            50% { transform: translateY(-100px) translateX(-30px) rotate(180deg); }
            75% { transform: translateY(-50px) translateX(-60px) rotate(270deg); }
        }

        /* Container */
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            position: relative;
            z-index: 1;
        }

        /* Glass Effect */
        .glass-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            padding: 30px;
            margin-bottom: 20px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .glass-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 48px rgba(0, 0, 0, 0.2);
        }

        /* Header */
        .header {
            text-align: center;
            color: white;
            margin-bottom: 40px;
            animation: fadeInDown 0.8s ease;
        }

        .header h1 {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }

        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }

        .header .logo {
            font-size: 4rem;
            margin-bottom: 20px;
            animation: bounce 2s infinite;
        }

        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }

        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 25px;
            color: white;
            display: flex;
            align-items: center;
            gap: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
        }

        .stat-card:hover {
            transform: scale(1.05);
            background: rgba(255, 255, 255, 0.2);
        }

        .stat-icon {
            font-size: 3rem;
            opacity: 0.8;
        }

        .stat-content h3 {
            font-size: 2.5rem;
            font-weight: 700;
        }

        .stat-content p {
            opacity: 0.8;
            margin-top: 5px;
        }

        /* Upload Area */
        .upload-area {
            background: rgba(255, 255, 255, 0.05);
            border: 3px dashed rgba(255, 255, 255, 0.3);
            border-radius: 15px;
            padding: 60px 20px;
            text-align: center;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 20px 0;
        }

        .upload-area:hover, .upload-area.dragover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.5);
            transform: scale(1.02);
        }

        .upload-area i {
            font-size: 4rem;
            margin-bottom: 20px;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .upload-area h3 {
            font-size: 1.5rem;
            margin-bottom: 10px;
        }

        .upload-area p {
            opacity: 0.8;
            margin-bottom: 20px;
        }

        /* Button Styles */
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

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        .btn-success {
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
            color: white;
        }

        .btn-danger {
            background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
            color: white;
        }

        .btn-info {
            background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
            color: white;
        }

        /* File List */
        .file-list {
            margin: 20px 0;
        }

        .file-item {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: white;
            animation: slideInLeft 0.5s ease;
        }

        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .file-info {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .file-icon {
            font-size: 2rem;
        }

        .file-details h4 {
            margin-bottom: 5px;
        }

        .file-details p {
            opacity: 0.7;
            font-size: 0.9rem;
        }

        /* Deployments Grid */
        .deployments-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .deployment-card {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 20px;
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
        }

        .deployment-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .deployment-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .deployment-title {
            font-size: 1.3rem;
            font-weight: 600;
        }

        .deployment-status {
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.85rem;
            background: rgba(72, 187, 120, 0.3);
        }

        .deployment-info {
            margin: 15px 0;
            opacity: 0.9;
        }

        .deployment-info p {
            margin: 8px 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .deployment-actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }

        .deployment-actions .btn {
            flex: 1;
            justify-content: center;
            padding: 10px;
            font-size: 0.9rem;
        }

        /* Progress Bar */
        .progress-bar {
            width: 100%;
            height: 30px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            overflow: hidden;
            margin: 20px 0;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #48bb78 0%, #38a169 100%);
            transition: width 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
        }

        /* Modal */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }

        .modal.active {
            display: flex;
        }

        .modal-content {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 30px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            animation: zoomIn 0.3s ease;
        }

        @keyframes zoomIn {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #e2e8f0;
        }

        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #718096;
        }

        /* Toast Notification */
        .toast {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 2000;
            animation: slideInRight 0.5s ease;
            max-width: 400px;
        }

        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .toast-success {
            border-left: 5px solid #48bb78;
        }

        .toast-error {
            border-left: 5px solid #f56565;
        }

        .toast i {
            font-size: 1.5rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }

            .stats-grid {
                grid-template-columns: 1fr;
            }

            .deployments-grid {
                grid-template-columns: 1fr;
            }
        }

        /* Hidden Input */
        input[type="file"] {
            display: none;
        }

        /* Login Section */
        .login-section {
            color: white;
            text-align: center;
        }

        .login-form {
            max-width: 400px;
            margin: 30px auto;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group input {
            width: 100%;
            padding: 15px;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            background: rgba(255, 255, 255, 0.1);
            color: white;
            font-size: 1rem;
        }

        .form-group input::placeholder {
            color: rgba(255, 255, 255, 0.6);
        }

        .user-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: white;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <!-- Animated Background -->
    <div class="animated-bg" id="animatedBg"></div>

    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo">
                <i class="fas fa-rocket"></i>
            </div>
            <h1>Professional Deployment Platform</h1>
            <p>Upload & Deploy Your Websites with Advanced PHP Technology</p>
        </div>

        <?php if ($isLoggedIn): ?>
            <!-- User Info -->
            <div class="glass-card">
                <div class="user-info">
                    <div>
                        <i class="fas fa-user-circle"></i>
                        <strong>Logged in as: <?php echo htmlspecialchars($username); ?></strong>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <a href="activity-log.php" class="btn btn-info">
                            <i class="fas fa-history"></i> Activity Log
                        </a>
                        <a href="settings.php" class="btn btn-primary">
                            <i class="fas fa-cog"></i> Settings
                        </a>
                        <a href="?logout=1" class="btn btn-danger">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </a>
                    </div>
                </div>
            </div>

            <!-- Stats Dashboard -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-globe"></i>
                    </div>
                    <div class="stat-content">
                        <h3><?php echo count($_SESSION['deployments']); ?></h3>
                        <p>Total Deployments</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="stat-content">
                        <h3><?php echo count(array_filter($_SESSION['deployments'], function($d) { return $d['status'] === 'active'; })); ?></h3>
                        <p>Active Sites</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-file-code"></i>
                    </div>
                    <div class="stat-content">
                        <h3><?php 
                            $totalFiles = 0;
                            foreach ($_SESSION['deployments'] as $dep) {
                                $totalFiles += $dep['files'];
                            }
                            echo $totalFiles;
                        ?></h3>
                        <p>Total Files</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-database"></i>
                    </div>
                    <div class="stat-content">
                        <h3><?php 
                            $totalSize = 0;
                            foreach ($_SESSION['deployments'] as $dep) {
                                $totalSize += $dep['size'];
                            }
                            echo number_format($totalSize / 1024 / 1024, 2);
                        ?> MB</h3>
                        <p>Total Size</p>
                    </div>
                </div>
            </div>

            <!-- Upload Section -->
            <div class="glass-card">
                <h2 style="color: white; margin-bottom: 20px;">
                    <i class="fas fa-cloud-upload-alt"></i> Upload Website Files
                </h2>
                <form action="upload.php" method="POST" enctype="multipart/form-data" id="uploadForm">
                    <div class="upload-area" id="uploadArea">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <h3>Drag & Drop Files Here</h3>
                        <p>or click to browse files</p>
                        <p style="font-size: 0.9rem; opacity: 0.7;">Supports: HTML, CSS, JS, PHP, Images, ZIP files, and more</p>
                        <input type="file" id="fileInput" name="files[]" multiple accept="*/*">
                        <button type="button" class="btn btn-primary" onclick="document.getElementById('fileInput').click()">
                            <i class="fas fa-folder-open"></i> Browse Files
                        </button>
                    </div>
                    <div class="file-list" id="fileList"></div>
                    <div id="uploadControls" style="display: none; text-align: center; margin-top: 20px;">
                        <button type="submit" class="btn btn-success" style="font-size: 1.2rem; padding: 15px 40px;">
                            <i class="fas fa-rocket"></i> Deploy Website
                        </button>
                    </div>
                </form>
            </div>

            <!-- Deployments List -->
            <div class="glass-card">
                <h2 style="color: white; margin-bottom: 20px;">
                    <i class="fas fa-history"></i> Your Deployments
                </h2>
                <?php if (empty($_SESSION['deployments'])): ?>
                    <p style="color: white; text-align: center; opacity: 0.8; padding: 40px;">
                        <i class="fas fa-inbox" style="font-size: 3rem; display: block; margin-bottom: 20px;"></i>
                        No deployments yet. Upload your first website above!
                    </p>
                <?php else: ?>
                    <div class="deployments-grid">
                        <?php foreach (array_reverse($_SESSION['deployments']) as $index => $deployment): ?>
                            <div class="deployment-card">
                                <div class="deployment-header">
                                    <div class="deployment-title">
                                        <i class="fas fa-folder"></i> <?php echo htmlspecialchars($deployment['name']); ?>
                                    </div>
                                    <div class="deployment-status">
                                        <?php echo $deployment['status']; ?>
                                    </div>
                                </div>
                                <div class="deployment-info">
                                    <p><i class="fas fa-calendar"></i> <?php echo date('d M Y H:i', $deployment['timestamp']); ?></p>
                                    <p><i class="fas fa-file"></i> <?php echo $deployment['files']; ?> files</p>
                                    <p><i class="fas fa-hdd"></i> <?php echo number_format($deployment['size'] / 1024, 2); ?> KB</p>
                                </div>
                                <div class="deployment-actions">
                                    <a href="deployments/<?php echo urlencode($deployment['id']); ?>/" target="_blank" class="btn btn-info">
                                        <i class="fas fa-eye"></i> View
                                    </a>
                                    <a href="?delete=<?php echo $index; ?>" class="btn btn-danger" onclick="return confirm('Are you sure you want to delete this deployment?')">
                                        <i class="fas fa-trash"></i> Delete
                                    </a>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>
        <?php else: ?>
            <!-- Login Section -->
            <div class="glass-card">
                <div class="login-section">
                    <h2 style="margin-bottom: 30px;">
                        <i class="fas fa-lock"></i> Admin Login
                    </h2>
                    <form action="" method="POST" class="login-form">
                        <div class="form-group">
                            <input type="text" name="username" placeholder="Username" required>
                        </div>
                        <div class="form-group">
                            <input type="password" name="password" placeholder="Password" required>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 15px; font-size: 1.1rem;">
                            <i class="fas fa-sign-in-alt"></i> Login
                        </button>
                        <p style="margin-top: 20px; opacity: 0.8;">
                            Demo: admin / admin123
                        </p>
                    </form>
                </div>
            </div>
        <?php endif; ?>
    </div>

    <script>
        // Create animated background particles
        function createParticles() {
            const bg = document.getElementById('animatedBg');
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.width = Math.random() * 100 + 50 + 'px';
                particle.style.height = particle.style.width;
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 5 + 's';
                particle.style.animationDuration = Math.random() * 10 + 10 + 's';
                bg.appendChild(particle);
            }
        }

        createParticles();

        // File upload handling
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const fileList = document.getElementById('fileList');
        const uploadControls = document.getElementById('uploadControls');

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            fileInput.files = e.dataTransfer.files;
            displayFiles();
        });

        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', displayFiles);

        function displayFiles() {
            fileList.innerHTML = '';
            const files = fileInput.files;
            
            if (files.length > 0) {
                uploadControls.style.display = 'block';
                
                for (let file of files) {
                    const fileItem = document.createElement('div');
                    fileItem.className = 'file-item';
                    
                    const icon = getFileIcon(file.name);
                    const size = formatFileSize(file.size);
                    
                    fileItem.innerHTML = `
                        <div class="file-info">
                            <div class="file-icon">
                                <i class="${icon}"></i>
                            </div>
                            <div class="file-details">
                                <h4>${file.name}</h4>
                                <p>${size}</p>
                            </div>
                        </div>
                        <i class="fas fa-check-circle" style="color: #48bb78; font-size: 1.5rem;"></i>
                    `;
                    
                    fileList.appendChild(fileItem);
                }
            } else {
                uploadControls.style.display = 'none';
            }
        }

        function getFileIcon(filename) {
            const ext = filename.split('.').pop().toLowerCase();
            const iconMap = {
                'html': 'fab fa-html5',
                'css': 'fab fa-css3-alt',
                'js': 'fab fa-js',
                'php': 'fab fa-php',
                'jpg': 'fas fa-file-image',
                'jpeg': 'fas fa-file-image',
                'png': 'fas fa-file-image',
                'gif': 'fas fa-file-image',
                'svg': 'fas fa-file-image',
                'pdf': 'fas fa-file-pdf',
                'zip': 'fas fa-file-archive',
                'txt': 'fas fa-file-alt'
            };
            return iconMap[ext] || 'fas fa-file';
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
        }

        // Show success message if upload was successful
        <?php if (isset($_SESSION['upload_success'])): ?>
            showToast('<?php echo $_SESSION['upload_success']; ?>', 'success');
            <?php unset($_SESSION['upload_success']); ?>
        <?php endif; ?>

        // Show error message if upload failed
        <?php if (isset($_SESSION['upload_error'])): ?>
            showToast('<?php echo $_SESSION['upload_error']; ?>', 'error');
            <?php unset($_SESSION['upload_error']); ?>
        <?php endif; ?>

        function showToast(message, type) {
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}" style="color: ${type === 'success' ? '#48bb78' : '#f56565'};"></i>
                <div>
                    <strong>${type === 'success' ? 'Success!' : 'Error!'}</strong>
                    <p style="margin: 5px 0 0 0;">${message}</p>
                </div>
            `;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.animation = 'slideInRight 0.5s ease reverse';
                setTimeout(() => toast.remove(), 500);
            }, 5000);
        }
    </script>
</body>
</html>

<?php
// Handle login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['username'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];
    
    // User credentials with hashed password
    // For production: Use database with password_hash() and password_verify()
    // Generated with: password_hash('admin123', PASSWORD_DEFAULT)
    $users = [
        'admin' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // admin123
    ];
    
    if (isset($users[$username]) && password_verify($password, $users[$username])) {
        $_SESSION['user'] = $username;
        header('Location: deploy.php');
        exit;
    }
}

// Handle logout
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: deploy.php');
    exit;
}

// Handle deployment deletion
if (isset($_GET['delete']) && $isLoggedIn) {
    $index = (int)$_GET['delete'];
    if (isset($_SESSION['deployments'][$index])) {
        $deployment = $_SESSION['deployments'][$index];
        $deployPath = DEPLOYMENTS_DIR . $deployment['id'];
        
        // Delete directory recursively
        if (is_dir($deployPath)) {
            deleteDirectory($deployPath);
        }
        
        unset($_SESSION['deployments'][$index]);
        $_SESSION['deployments'] = array_values($_SESSION['deployments']);
        $_SESSION['upload_success'] = 'Deployment deleted successfully!';
    }
    header('Location: deploy.php');
    exit;
}

// Helper function to delete directory recursively
function deleteDirectory($dir) {
    if (!is_dir($dir)) {
        return;
    }
    
    $files = array_diff(scandir($dir), ['.', '..']);
    foreach ($files as $file) {
        $path = $dir . '/' . $file;
        is_dir($path) ? deleteDirectory($path) : unlink($path);
    }
    rmdir($dir);
}
?>
