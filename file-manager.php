<?php
/**
 * Professional Website Deployment Platform
 * Advanced File Manager
 */

session_start();

// Check if user is logged in
if (!isset($_SESSION['user'])) {
    header('Location: deploy.php');
    exit;
}

// Configuration
define('DEPLOYMENTS_DIR', __DIR__ . '/deployments/');

// Get deployment ID from URL
$deploymentId = $_GET['id'] ?? null;

if (!$deploymentId) {
    header('Location: deploy.php');
    exit;
}

$deploymentPath = DEPLOYMENTS_DIR . $deploymentId;

if (!is_dir($deploymentPath)) {
    header('Location: deploy.php');
    exit;
}

// Handle file operations
$message = '';
$messageType = '';

// Delete file
if (isset($_GET['delete'])) {
    $file = basename($_GET['delete']);
    $filePath = $deploymentPath . '/' . $file;
    if (file_exists($filePath) && is_file($filePath)) {
        unlink($filePath);
        $message = "File deleted successfully!";
        $messageType = "success";
    }
}

// Upload new file to deployment
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['newFile'])) {
    $file = $_FILES['newFile'];
    if ($file['error'] === UPLOAD_ERR_OK) {
        $fileName = basename($file['name']);
        $fileName = preg_replace('/[^a-zA-Z0-9._-]/', '_', $fileName);
        $destinationPath = $deploymentPath . '/' . $fileName;
        
        if (move_uploaded_file($file['tmp_name'], $destinationPath)) {
            $message = "File uploaded successfully!";
            $messageType = "success";
        } else {
            $message = "Failed to upload file!";
            $messageType = "error";
        }
    }
}

// Get all files in deployment
function getDirectoryFiles($dir, $basePath = '') {
    $files = [];
    $items = array_diff(scandir($dir), ['.', '..']);
    
    foreach ($items as $item) {
        $path = $dir . '/' . $item;
        $relativePath = $basePath . $item;
        
        if (is_dir($path)) {
            $files[] = [
                'name' => $item,
                'path' => $relativePath,
                'type' => 'directory',
                'size' => 0,
                'modified' => filemtime($path),
                'children' => getDirectoryFiles($path, $relativePath . '/')
            ];
        } else {
            $files[] = [
                'name' => $item,
                'path' => $relativePath,
                'type' => 'file',
                'extension' => pathinfo($item, PATHINFO_EXTENSION),
                'size' => filesize($path),
                'modified' => filemtime($path)
            ];
        }
    }
    
    return $files;
}

$files = getDirectoryFiles($deploymentPath);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Manager - <?php echo htmlspecialchars($deploymentId); ?></title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
        }

        .header {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 20px;
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .header h1 {
            font-size: 2rem;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .header-actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }

        .btn {
            padding: 12px 25px;
            border: none;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            text-decoration: none;
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
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        .card {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        }

        .file-manager {
            margin-top: 20px;
        }

        .file-tree {
            list-style: none;
            padding-left: 0;
        }

        .file-tree > li {
            margin-bottom: 10px;
        }

        .file-item, .folder-item {
            background: #f7fafc;
            padding: 15px 20px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: all 0.3s ease;
            border: 1px solid #e2e8f0;
        }

        .file-item:hover, .folder-item:hover {
            background: #edf2f7;
            transform: translateX(5px);
        }

        .file-info {
            display: flex;
            align-items: center;
            gap: 15px;
            flex: 1;
        }

        .file-icon {
            font-size: 1.8rem;
            width: 40px;
            text-align: center;
        }

        .file-details h4 {
            color: #2d3748;
            margin-bottom: 5px;
        }

        .file-details p {
            color: #718096;
            font-size: 0.85rem;
        }

        .file-actions {
            display: flex;
            gap: 10px;
        }

        .file-actions .btn {
            padding: 8px 15px;
            font-size: 0.9rem;
        }

        .folder-children {
            list-style: none;
            padding-left: 30px;
            margin-top: 10px;
        }

        .upload-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 15px;
            margin-bottom: 30px;
        }

        .upload-section h3 {
            margin-bottom: 15px;
        }

        .upload-form {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .upload-form input[type="file"] {
            flex: 1;
            padding: 10px;
            border-radius: 8px;
            border: none;
            background: rgba(255, 255, 255, 0.2);
            color: white;
        }

        .upload-form input[type="file"]::file-selector-button {
            background: rgba(255, 255, 255, 0.3);
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
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

        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        }

        .stat-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
        }

        .stat-box h3 {
            font-size: 2rem;
            margin-bottom: 5px;
        }

        .stat-box p {
            opacity: 0.9;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>
                <i class="fas fa-folder-open"></i>
                File Manager
            </h1>
            <p>Deployment: <?php echo htmlspecialchars($deploymentId); ?></p>
            <div class="header-actions">
                <a href="deploy.php" class="btn btn-secondary">
                    <i class="fas fa-arrow-left"></i> Back to Dashboard
                </a>
                <a href="deployments/<?php echo urlencode($deploymentId); ?>/" target="_blank" class="btn btn-primary">
                    <i class="fas fa-eye"></i> View Deployed Site
                </a>
            </div>
        </div>

        <div class="card">
            <?php if ($message): ?>
                <div class="message message-<?php echo $messageType; ?>">
                    <i class="fas fa-<?php echo $messageType === 'success' ? 'check-circle' : 'exclamation-circle'; ?>"></i>
                    <?php echo htmlspecialchars($message); ?>
                </div>
            <?php endif; ?>

            <!-- Stats -->
            <div class="stats">
                <div class="stat-box">
                    <h3><?php echo count($files); ?></h3>
                    <p><i class="fas fa-file"></i> Total Items</p>
                </div>
                <div class="stat-box">
                    <h3><?php 
                        $totalSize = 0;
                        array_walk_recursive($files, function($item) use (&$totalSize) {
                            if (isset($item['size'])) $totalSize += $item['size'];
                        });
                        echo number_format($totalSize / 1024, 2);
                    ?> KB</h3>
                    <p><i class="fas fa-hdd"></i> Total Size</p>
                </div>
                <div class="stat-box">
                    <h3><?php echo date('d M Y'); ?></h3>
                    <p><i class="fas fa-calendar"></i> Last Modified</p>
                </div>
            </div>

            <!-- Upload Section -->
            <div class="upload-section">
                <h3><i class="fas fa-cloud-upload-alt"></i> Upload New File</h3>
                <form action="" method="POST" enctype="multipart/form-data" class="upload-form">
                    <input type="file" name="newFile" required>
                    <button type="submit" class="btn btn-success">
                        <i class="fas fa-upload"></i> Upload
                    </button>
                </form>
            </div>

            <!-- File Manager -->
            <div class="file-manager">
                <h3 style="color: #667eea; margin-bottom: 20px;">
                    <i class="fas fa-files"></i> Files & Folders
                </h3>
                
                <?php if (empty($files)): ?>
                    <p style="text-align: center; padding: 40px; color: #718096;">
                        <i class="fas fa-inbox" style="font-size: 3rem; display: block; margin-bottom: 15px;"></i>
                        No files in this deployment
                    </p>
                <?php else: ?>
                    <ul class="file-tree">
                        <?php foreach ($files as $file): ?>
                            <li>
                                <?php if ($file['type'] === 'directory'): ?>
                                    <div class="folder-item">
                                        <div class="file-info">
                                            <div class="file-icon" style="color: #f6ad55;">
                                                <i class="fas fa-folder"></i>
                                            </div>
                                            <div class="file-details">
                                                <h4><?php echo htmlspecialchars($file['name']); ?></h4>
                                                <p><?php echo count($file['children']); ?> items</p>
                                            </div>
                                        </div>
                                    </div>
                                    <?php if (!empty($file['children'])): ?>
                                        <ul class="folder-children">
                                            <?php foreach ($file['children'] as $child): ?>
                                                <li>
                                                    <div class="file-item">
                                                        <div class="file-info">
                                                            <div class="file-icon" style="color: <?php echo getFileColor($child['extension'] ?? ''); ?>;">
                                                                <i class="<?php echo getFileIcon($child['extension'] ?? ''); ?>"></i>
                                                            </div>
                                                            <div class="file-details">
                                                                <h4><?php echo htmlspecialchars($child['name']); ?></h4>
                                                                <p><?php echo number_format($child['size'] / 1024, 2); ?> KB • Modified <?php echo date('M d, Y H:i', $child['modified']); ?></p>
                                                            </div>
                                                        </div>
                                                        <div class="file-actions">
                                                            <a href="deployments/<?php echo urlencode($deploymentId); ?>/<?php echo urlencode($child['path']); ?>" target="_blank" class="btn btn-primary">
                                                                <i class="fas fa-eye"></i>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </li>
                                            <?php endforeach; ?>
                                        </ul>
                                    <?php endif; ?>
                                <?php else: ?>
                                    <div class="file-item">
                                        <div class="file-info">
                                            <div class="file-icon" style="color: <?php echo getFileColor($file['extension']); ?>;">
                                                <i class="<?php echo getFileIcon($file['extension']); ?>"></i>
                                            </div>
                                            <div class="file-details">
                                                <h4><?php echo htmlspecialchars($file['name']); ?></h4>
                                                <p><?php echo number_format($file['size'] / 1024, 2); ?> KB • Modified <?php echo date('M d, Y H:i', $file['modified']); ?></p>
                                            </div>
                                        </div>
                                        <div class="file-actions">
                                            <a href="deployments/<?php echo urlencode($deploymentId); ?>/<?php echo urlencode($file['name']); ?>" target="_blank" class="btn btn-primary">
                                                <i class="fas fa-eye"></i> View
                                            </a>
                                            <a href="?id=<?php echo urlencode($deploymentId); ?>&delete=<?php echo urlencode($file['name']); ?>" class="btn btn-danger" onclick="return confirm('Are you sure you want to delete this file?')">
                                                <i class="fas fa-trash"></i> Delete
                                            </a>
                                        </div>
                                    </div>
                                <?php endif; ?>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                <?php endif; ?>
            </div>
        </div>
    </div>
</body>
</html>

<?php
function getFileIcon($extension) {
    $iconMap = [
        'html' => 'fab fa-html5',
        'htm' => 'fab fa-html5',
        'css' => 'fab fa-css3-alt',
        'js' => 'fab fa-js',
        'php' => 'fab fa-php',
        'json' => 'fas fa-file-code',
        'xml' => 'fas fa-file-code',
        'jpg' => 'fas fa-file-image',
        'jpeg' => 'fas fa-file-image',
        'png' => 'fas fa-file-image',
        'gif' => 'fas fa-file-image',
        'svg' => 'fas fa-file-image',
        'pdf' => 'fas fa-file-pdf',
        'zip' => 'fas fa-file-archive',
        'txt' => 'fas fa-file-alt',
        'md' => 'fab fa-markdown'
    ];
    return $iconMap[$extension] ?? 'fas fa-file';
}

function getFileColor($extension) {
    $colorMap = [
        'html' => '#e34f26',
        'htm' => '#e34f26',
        'css' => '#1572b6',
        'js' => '#f7df1e',
        'php' => '#777bb4',
        'json' => '#ffa500',
        'jpg' => '#4caf50',
        'jpeg' => '#4caf50',
        'png' => '#4caf50',
        'gif' => '#4caf50',
        'svg' => '#ff9800',
        'pdf' => '#f40f02',
        'zip' => '#ffc107'
    ];
    return $colorMap[$extension] ?? '#718096';
}
?>
