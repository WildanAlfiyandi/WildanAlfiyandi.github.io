<?php
/**
 * Professional Website Deployment Platform
 * File Upload & Deployment Handler
 */

session_start();

// Configuration
define('DEPLOYMENTS_DIR', __DIR__ . '/deployments/');
define('MAX_FILE_SIZE', 50 * 1024 * 1024); // 50MB
define('ALLOWED_EXTENSIONS', ['html', 'htm', 'css', 'js', 'php', 'json', 'xml', 'txt', 'md', 
                              'jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ico', 
                              'woff', 'woff2', 'ttf', 'eot', 'otf',
                              'pdf', 'zip', 'rar', '7z', 'mp4', 'webm', 'mp3', 'wav']);

// Check if user is logged in
if (!isset($_SESSION['user'])) {
    header('Location: deploy.php');
    exit;
}

// Handle file upload
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['files'])) {
    $files = $_FILES['files'];
    $uploadErrors = [];
    $uploadedFiles = [];
    
    // Generate unique deployment ID
    $deploymentId = 'deploy-' . uniqid() . '-' . time();
    $deploymentPath = DEPLOYMENTS_DIR . $deploymentId;
    
    // Create deployment directory
    if (!is_dir($deploymentPath)) {
        mkdir($deploymentPath, 0755, true);
    }
    
    // Process each uploaded file
    $totalSize = 0;
    $fileCount = 0;
    
    for ($i = 0; $i < count($files['name']); $i++) {
        if ($files['error'][$i] !== UPLOAD_ERR_OK) {
            $uploadErrors[] = "Error uploading {$files['name'][$i]}";
            continue;
        }
        
        $fileName = basename($files['name'][$i]);
        $fileSize = $files['size'][$i];
        $fileTmpPath = $files['tmp_name'][$i];
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        
        // Validate file size
        if ($fileSize > MAX_FILE_SIZE) {
            $uploadErrors[] = "File {$fileName} exceeds maximum size limit";
            continue;
        }
        
        // Validate file extension
        if (!in_array($fileExtension, ALLOWED_EXTENSIONS)) {
            $uploadErrors[] = "File type not allowed: {$fileName}";
            continue;
        }
        
        // Security: Sanitize filename
        $fileName = preg_replace('/[^a-zA-Z0-9._-]/', '_', $fileName);
        $destinationPath = $deploymentPath . '/' . $fileName;
        
        // Check if it's a ZIP file and extract it
        if (in_array($fileExtension, ['zip', 'rar', '7z'])) {
            if ($fileExtension === 'zip') {
                $zip = new ZipArchive();
                if ($zip->open($fileTmpPath) === true) {
                    // Extract to deployment directory
                    $zip->extractTo($deploymentPath);
                    $extractedCount = $zip->numFiles;
                    $zip->close();
                    
                    // Count extracted files
                    $fileCount += $extractedCount;
                    $totalSize += $fileSize;
                    $uploadedFiles[] = [
                        'name' => $fileName,
                        'size' => $fileSize,
                        'type' => 'archive',
                        'extracted' => $extractedCount
                    ];
                } else {
                    $uploadErrors[] = "Failed to extract ZIP file: {$fileName}";
                }
            } else {
                // For RAR and 7z, just save the file (requires additional PHP extensions)
                if (move_uploaded_file($fileTmpPath, $destinationPath)) {
                    $fileCount++;
                    $totalSize += $fileSize;
                    $uploadedFiles[] = [
                        'name' => $fileName,
                        'size' => $fileSize,
                        'type' => 'archive'
                    ];
                }
            }
        } else {
            // Regular file upload
            if (move_uploaded_file($fileTmpPath, $destinationPath)) {
                $fileCount++;
                $totalSize += $fileSize;
                $uploadedFiles[] = [
                    'name' => $fileName,
                    'size' => $fileSize,
                    'type' => $fileExtension
                ];
            } else {
                $uploadErrors[] = "Failed to upload {$fileName}";
            }
        }
    }
    
    // Create index.php if no index file exists
    $indexFiles = ['index.html', 'index.htm', 'index.php'];
    $hasIndex = false;
    
    foreach ($indexFiles as $indexFile) {
        if (file_exists($deploymentPath . '/' . $indexFile)) {
            $hasIndex = true;
            break;
        }
    }
    
    // If no index file, create a default one that lists files
    if (!$hasIndex) {
        $defaultIndex = createDefaultIndex($deploymentPath, $deploymentId);
        file_put_contents($deploymentPath . '/index.php', $defaultIndex);
        $fileCount++;
    }
    
    // Save deployment info to session
    if (!isset($_SESSION['deployments'])) {
        $_SESSION['deployments'] = [];
    }
    
    $deploymentInfo = [
        'id' => $deploymentId,
        'name' => $deploymentId,
        'timestamp' => time(),
        'files' => $fileCount,
        'size' => $totalSize,
        'status' => 'active',
        'uploaded_files' => $uploadedFiles
    ];
    
    $_SESSION['deployments'][] = $deploymentInfo;
    
    // Set success message
    if (empty($uploadErrors)) {
        $_SESSION['upload_success'] = "Successfully deployed {$fileCount} files! Your site is now live.";
    } else {
        $_SESSION['upload_error'] = "Some files failed to upload: " . implode(', ', $uploadErrors);
    }
    
    // Redirect back to main page
    header('Location: deploy.php');
    exit;
}

/**
 * Create a default index file if none exists
 */
function createDefaultIndex($deploymentPath, $deploymentId) {
    $files = array_diff(scandir($deploymentPath), ['.', '..']);
    
    $html = '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deployed Site - ' . htmlspecialchars($deploymentId) . '</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        h1 {
            color: #667eea;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .subtitle {
            color: #718096;
            margin-bottom: 40px;
            font-size: 1.1rem;
        }
        
        .file-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        
        .file-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 25px;
            border-radius: 15px;
            color: white;
            text-decoration: none;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .file-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        
        .file-icon {
            font-size: 3rem;
            margin-bottom: 15px;
            opacity: 0.9;
        }
        
        .file-name {
            font-weight: 600;
            word-break: break-word;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        
        .stat-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 15px;
            text-align: center;
        }
        
        .stat-box h3 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        .stat-box p {
            opacity: 0.9;
        }
        
        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: #667eea;
            color: white;
            padding: 12px 25px;
            border-radius: 10px;
            text-decoration: none;
            margin-bottom: 30px;
            transition: all 0.3s ease;
        }
        
        .back-link:hover {
            background: #764ba2;
            transform: translateX(-5px);
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="../deploy.php" class="back-link">
            <i class="fas fa-arrow-left"></i> Back to Dashboard
        </a>
        
        <h1>
            <i class="fas fa-rocket"></i>
            Deployment: ' . htmlspecialchars($deploymentId) . '
        </h1>
        <p class="subtitle">Your website has been successfully deployed!</p>
        
        <div class="stats">
            <div class="stat-box">
                <h3>' . count($files) . '</h3>
                <p><i class="fas fa-file"></i> Total Files</p>
            </div>
            <div class="stat-box">
                <h3>' . date('H:i') . '</h3>
                <p><i class="fas fa-clock"></i> Deployed At</p>
            </div>
        </div>
        
        <h2 style="color: #667eea; margin-bottom: 20px;">
            <i class="fas fa-folder-open"></i> Available Files
        </h2>
        
        <div class="file-grid">';
    
    foreach ($files as $file) {
        if (is_file($deploymentPath . '/' . $file) && $file !== 'index.php') {
            $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            $icon = getFileIconClass($extension);
            
            $html .= '
            <a href="' . htmlspecialchars($file) . '" class="file-card" target="_blank">
                <div class="file-icon">
                    <i class="' . $icon . '"></i>
                </div>
                <div class="file-name">' . htmlspecialchars($file) . '</div>
            </a>';
        }
    }
    
    $html .= '
        </div>
    </div>
</body>
</html>';
    
    return $html;
}

/**
 * Get appropriate icon class for file extension
 */
function getFileIconClass($extension) {
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

// If accessed directly without POST, redirect to main page
header('Location: deploy.php');
exit;
?>
