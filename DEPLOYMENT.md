# 🚀 Professional Website Deployment Platform

A powerful PHP-based platform for deploying and managing websites with advanced features and modern UI/UX.

## ✨ Features

### Core Functionality
- **📤 Multi-File Upload**: Upload individual files or multiple files at once
- **📦 ZIP Extraction**: Automatic extraction of ZIP archives
- **🌐 Instant Deployment**: Deploy websites instantly with auto-generated directories
- **👁️ Live Preview**: View deployed websites in real-time
- **📁 File Manager**: Advanced file management with upload, view, and delete capabilities
- **📊 Analytics Dashboard**: Track deployments, files, and storage usage

### Advanced Features
- **🎨 Modern UI/UX**: Beautiful glass-morphism design with gradient backgrounds
- **✨ Animated Background**: Dynamic particle animation system
- **🔐 Secure Authentication**: Session-based login system
- **📱 Responsive Design**: Works perfectly on all devices
- **🎯 Drag & Drop**: Intuitive drag-and-drop file upload interface
- **🔔 Toast Notifications**: Real-time feedback for all actions
- **📈 Real-time Statistics**: Live deployment statistics and metrics

### Supported File Types
- **Web Files**: HTML, CSS, JavaScript, PHP
- **Images**: JPG, JPEG, PNG, GIF, SVG, WebP, ICO
- **Documents**: PDF, TXT, MD, JSON, XML
- **Fonts**: WOFF, WOFF2, TTF, EOT, OTF
- **Archives**: ZIP, RAR, 7Z
- **Media**: MP4, WebM, MP3, WAV

## 🛠️ Installation

### Requirements
- PHP 7.4 or higher
- Apache/Nginx web server
- PHP Extensions:
  - `zip` (for ZIP extraction)
  - `fileinfo` (for file type detection)
  - `session` (for authentication)

### Setup Instructions

1. **Clone or Download**
   ```bash
   git clone https://github.com/WildanAlfiyandi/WildanAlfiyandi.github.io.git
   cd WildanAlfiyandi.github.io
   ```

2. **Configure Web Server**
   
   **For Apache:**
   - Ensure `mod_rewrite` is enabled
   - Make sure `.htaccess` is allowed
   - Set proper file permissions:
     ```bash
     chmod 755 .
     chmod 666 *.php
     mkdir -p deployments
     chmod 777 deployments
     ```

   **For Nginx:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /path/to/WildanAlfiyandi.github.io;
       index deploy.php index.php index.html;

       location / {
           try_files $uri $uri/ /deploy.php?$query_string;
       }

       location ~ \.php$ {
           fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
           fastcgi_index index.php;
           include fastcgi_params;
           fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
       }
   }
   ```

3. **Set File Permissions**
   ```bash
   # Create deployments directory
   mkdir -p deployments
   
   # Set write permissions
   chmod 755 deployments
   ```

4. **Configure PHP Settings** (Optional)
   
   Edit `php.ini` or create `.user.ini`:
   ```ini
   upload_max_filesize = 50M
   post_max_size = 50M
   max_execution_time = 300
   memory_limit = 256M
   ```

5. **Access the Platform**
   
   Open your browser and navigate to:
   ```
   http://localhost/deploy.php
   ```
   Or your configured domain.

## 🔑 Default Credentials

```
Username: admin
Password: admin123
```

**⚠️ Important:** Change the default credentials in production by modifying the authentication logic in `deploy.php`.

## 📖 Usage Guide

### 1. Login
- Navigate to `deploy.php`
- Enter credentials (default: admin/admin123)
- Click "Login"

### 2. Upload Files

#### Method 1: Drag & Drop
- Drag files from your computer directly to the upload area
- Files will be automatically queued for upload

#### Method 2: Browse Files
- Click "Browse Files" button
- Select one or multiple files
- Click "Deploy Website"

#### Method 3: ZIP Upload
- Upload a ZIP file containing your entire website
- The system will automatically extract all files

### 3. View Deployments
- All deployments are listed in the "Your Deployments" section
- Each deployment shows:
  - Deployment name and ID
  - Number of files
  - Total size
  - Creation date
  - Status (active)

### 4. Manage Files
- Click "View" to see the deployed website
- Click "Delete" to remove a deployment
- Use the File Manager for advanced file operations

### 5. File Manager
- Access detailed file management for each deployment
- Upload additional files to existing deployments
- View file details (size, modification date)
- Delete individual files

## 🎨 Customization

### Change Theme Colors
Edit the CSS variables in `deploy.php`:
```css
:root {
    --primary: #667eea;
    --secondary: #764ba2;
    --success: #48bb78;
    --danger: #f56565;
    /* Add more customizations */
}
```

### Modify Upload Limits
Edit the constants in `upload.php`:
```php
define('MAX_FILE_SIZE', 50 * 1024 * 1024); // 50MB
define('ALLOWED_EXTENSIONS', ['html', 'css', 'js', /* ... */]);
```

### Change Deployment Directory
Modify the `DEPLOYMENTS_DIR` constant:
```php
define('DEPLOYMENTS_DIR', __DIR__ . '/your-custom-path/');
```

## 🔒 Security Considerations

### Current Security Features
- ✅ File extension validation
- ✅ File size limits
- ✅ Filename sanitization
- ✅ Path traversal protection
- ✅ Session-based authentication
- ✅ XSS prevention with `htmlspecialchars()`

### Recommended Security Enhancements for Production

1. **Use Strong Passwords**
   ```php
   // Use password hashing
   $hashedPassword = password_hash('your-password', PASSWORD_DEFAULT);
   ```

2. **Enable HTTPS**
   - Use SSL/TLS certificates
   - Redirect HTTP to HTTPS

3. **Implement CSRF Protection**
   ```php
   // Generate token
   $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
   
   // Verify token
   if ($_POST['csrf_token'] !== $_SESSION['csrf_token']) {
       die('Invalid CSRF token');
   }
   ```

4. **Add Rate Limiting**
   - Limit upload attempts
   - Implement IP-based throttling

5. **Database Integration**
   - Store user credentials securely
   - Track deployment metadata

6. **File Quarantine**
   - Scan uploaded files for malware
   - Implement virus scanning

7. **Restrict PHP Execution**
   - Add `.htaccess` in deployments folder:
     ```apache
     php_flag engine off
     ```

## 📁 File Structure

```
WildanAlfiyandi.github.io/
├── deploy.php          # Main deployment interface
├── upload.php          # File upload handler
├── file-manager.php    # Advanced file management
├── deployments/        # Directory for deployed sites
│   ├── deploy-xxx-1/   # Individual deployment
│   └── deploy-xxx-2/
├── index.html          # Original static site (preserved)
├── script.js           # Original scripts (preserved)
├── styles.css          # Original styles (preserved)
├── README.md           # This file
└── DEPLOYMENT.md       # This deployment documentation
```

## 🐛 Troubleshooting

### Upload Fails
- **Check PHP upload limits**: Verify `upload_max_filesize` and `post_max_size` in `php.ini`
- **Check directory permissions**: Ensure `deployments/` has write permissions (755 or 777)
- **Check disk space**: Ensure sufficient storage is available

### ZIP Extraction Fails
- **Verify ZIP extension**: Ensure PHP ZIP extension is installed (`php -m | grep zip`)
- **Check file integrity**: Ensure the ZIP file is not corrupted
- **Check extraction path**: Verify deployment directory exists and is writable

### Deployed Site Not Accessible
- **Check web server configuration**: Ensure proper routing to deployment directories
- **Check file permissions**: Ensure files are readable (644 for files, 755 for directories)
- **Check index file**: Ensure an index.html or index.php exists

### Session Issues
- **Check session directory**: Ensure PHP can write session files
- **Check session settings**: Verify session configuration in `php.ini`
- **Clear browser cache**: Try accessing in incognito mode

## 🚀 Performance Optimization

### For High Traffic
1. **Enable OPcache**
   ```ini
   opcache.enable=1
   opcache.memory_consumption=128
   opcache.max_accelerated_files=10000
   ```

2. **Use CDN for Assets**
   - Host Font Awesome and other libraries on CDN
   - Implement browser caching

3. **Optimize File Handling**
   - Implement lazy loading for file lists
   - Add pagination for large deployments

4. **Database Integration**
   - Store deployment metadata in database
   - Reduce session storage usage

## 📝 License

This project is open-source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## 📧 Support

For questions or support, please open an issue on GitHub.

## 🎉 Credits

Created with ❤️ by [Wildan Alfiyandi](https://github.com/WildanAlfiyandi)

---

**Note**: This platform is designed for development and testing purposes. For production use, implement additional security measures and proper authentication systems.
