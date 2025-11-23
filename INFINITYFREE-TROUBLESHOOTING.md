# InfinityFree Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: "Error" when viewing deployed website

**Problem**: After uploading HTML files and clicking "View", you get an error or blank page.

**Causes & Solutions**:

#### Solution 1: Check .htaccess Configuration
```apache
# Make sure .htaccess has these lines:
DirectoryIndex index.html index.htm index.php

# Enable following symlinks
Options +FollowSymLinks

# Enable directory browsing (temporarily for testing)
Options +Indexes
```

#### Solution 2: Verify File Permissions
```
Files should be: 644 (readable)
Folders should be: 755 (readable + executable)

Via FTP (FileZilla):
- Right-click on deployments folder → File permissions → 755
- Right-click on files inside → File permissions → 644
```

#### Solution 3: Check Deployment Path
The deployed files should be in:
```
htdocs/deployments/deploy-xxxxx-xxxxx/
```

Not in a subdirectory. If files are nested incorrectly:
1. Move all files to the deployment root
2. Ensure index.html or index.php is at the root level

#### Solution 4: Verify URL Format
Correct URL format:
```
http://deploy.wuaze.com/deployments/deploy-xxxxx-xxxxx/
```

NOT:
```
http://deploy.wuaze.com/deployments/deploy-xxxxx-xxxxx/index.html
```

### Issue 2: "404 Not Found"

**Causes**:
1. Deployment folder doesn't exist
2. Incorrect file permissions
3. .htaccess blocking access

**Solutions**:

**Step 1**: Verify folder exists
- Login to File Manager in InfinityFree
- Navigate to `htdocs/deployments/`
- Confirm deployment folder exists

**Step 2**: Create .htaccess in deployments folder
```apache
# /htdocs/deployments/.htaccess
Options +Indexes +FollowSymLinks
DirectoryIndex index.html index.htm index.php

<IfModule mod_rewrite.c>
    RewriteEngine Off
</IfModule>

# Allow access to all files
<FilesMatch ".*">
    Order allow,deny
    Allow from all
</FilesMatch>
```

**Step 3**: Check main .htaccess
Ensure it doesn't block /deployments/ directory:
```apache
# Should NOT have:
# Deny from all in /deployments/
```

### Issue 3: ZIP Files Not Extracting

**Causes**:
1. ZipArchive extension not enabled
2. File permissions
3. Memory limit exceeded

**Solutions**:

**Check if ZIP extension is available**:
Create test.php:
```php
<?php
if (class_exists('ZipArchive')) {
    echo "ZIP extension is enabled!";
} else {
    echo "ZIP extension is NOT available";
}
?>
```

If not available:
- InfinityFree DOES support ZipArchive
- Contact support or try re-uploading files

**Alternative**: Upload ZIP via File Manager
1. Upload ZIP to deployments folder
2. Use InfinityFree File Manager's Extract feature
3. Manually extract the ZIP

### Issue 4: PHP Files Show as Download

**Cause**: PHP not being parsed

**Solutions**:

**Add to .htaccess**:
```apache
AddType application/x-httpd-php .php .phtml
AddHandler x-httpd-php .php .phtml
```

**Or rename files**:
- index.php → index.php5
- Then update .htaccess:
```apache
AddHandler x-httpd-php5 .php
```

### Issue 5: "Internal Server Error" (500)

**Common Causes**:

**1. .htaccess syntax error**
- Comment out lines one by one to find the issue
- Check for typos

**2. PHP error**
Enable error reporting temporarily:
```php
<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
// Rest of your code
?>
```

**3. Memory/Time limit**
Add to config.php:
```php
ini_set('memory_limit', '128M');
ini_set('max_execution_time', '300');
```

### Issue 6: Files Upload but Don't Appear

**Solutions**:

**Step 1**: Check session storage
Add to deploy.php (temporarily):
```php
<?php
session_start();
echo "<pre>";
print_r($_SESSION['deployments']);
echo "</pre>";
?>
```

**Step 2**: Verify filesystem
```php
<?php
$deploymentsDir = __DIR__ . '/deployments/';
$folders = scandir($deploymentsDir);
echo "<pre>";
print_r($folders);
echo "</pre>";
?>
```

**Step 3**: Check write permissions
```php
<?php
$deploymentsDir = __DIR__ . '/deployments/';
if (is_writable($deploymentsDir)) {
    echo "Deployments folder is writable";
} else {
    echo "ERROR: Deployments folder is NOT writable";
    echo "<br>Permissions: " . substr(sprintf('%o', fileperms($deploymentsDir)), -4);
}
?>
```

### Issue 7: Domain Not Working (deploy.wuaze.com)

**Solutions**:

**Step 1**: Update DNS Settings
At your domain registrar (Niagahoster, Cloudflare, etc.):
```
A Record:
Host: @ or deploy
Points to: 185.27.134.10 (InfinityFree IP)
TTL: 14400

CNAME Record:
Host: www
Points to: deploy.wuaze.com
TTL: 14400
```

**Step 2**: Add domain in InfinityFree
1. Go to "Addon Domains" in control panel
2. Add: deploy.wuaze.com
3. Document root: htdocs (or htdocs/public_html)

**Step 3**: Update config.php
```php
define('BASE_DOMAIN', 'deploy.wuaze.com');
```

**Step 4**: Wait for propagation
- DNS changes take 1-48 hours
- Check status: https://www.whatsmydns.net/

### Issue 8: Upload Fails Silently

**Debugging Steps**:

**Step 1**: Check upload.php for errors
Add at the top:
```php
<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error.log');
?>
```

**Step 2**: Verify POST max size
InfinityFree limits:
- upload_max_filesize: 10MB
- post_max_size: 10MB
- max_execution_time: 60 seconds

Create php.ini in htdocs:
```ini
upload_max_filesize = 10M
post_max_size = 12M
max_execution_time = 120
memory_limit = 128M
```

**Step 3**: Check file type restrictions
Some file types may be blocked. Try:
1. Uploading just HTML
2. Then CSS
3. Then images
4. Finally ZIP

### Quick Diagnostic Checklist

Before asking for help, verify:

- [ ] Files exist in htdocs/deployments/deploy-xxxxx/
- [ ] File permissions are 644 for files, 755 for folders
- [ ] .htaccess exists and is correct
- [ ] config.php has correct BASE_DOMAIN
- [ ] PHP version is 7.4+ (check in InfinityFree control panel)
- [ ] index.html or index.php exists in deployment folder
- [ ] No PHP errors in error.log
- [ ] Sessions are working (check with phpinfo())
- [ ] Directory listing works when accessing /deployments/

### Testing URL

To test if your deployment is accessible, try these URLs:

1. **Direct deployment folder:**
   ```
   http://deploy.wuaze.com/deployments/
   ```
   Should show folder list (if Indexes is on)

2. **Specific deployment:**
   ```
   http://deploy.wuaze.com/deployments/deploy-xxxxx-xxxxx/
   ```
   Should load index.html or index.php

3. **Specific file:**
   ```
   http://deploy.wuaze.com/deployments/deploy-xxxxx-xxxxx/test.html
   ```
   Should show the file

### Still Having Issues?

**Collect this information:**

1. **Error message** (exact text)
2. **URL** you're trying to access
3. **File structure** (screenshot of File Manager)
4. **Permissions** (of files and folders)
5. **PHP version** (from control panel)
6. **error.log contents** (if any)

**Test deployment manually:**

1. Create test folder:
   ```
   htdocs/test-deploy/
   ```

2. Create simple index.html:
   ```html
   <h1>Test Deployment Works!</h1>
   ```

3. Access:
   ```
   http://deploy.wuaze.com/test-deploy/
   ```

4. If this works, issue is with upload.php
5. If this doesn't work, issue is with hosting/domain configuration

### InfinityFree-Specific Notes

1. **Free hosting limits:**
   - 5GB disk space
   - Unlimited bandwidth (with fair use)
   - 10MB file upload limit
   - 50,000 hits per day

2. **Not available:**
   - Shell access
   - Cron jobs (use external services)
   - Certain PHP functions (exec, shell_exec)

3. **Available:**
   - PHP 7.4/8.0
   - MySQL databases
   - FTP access
   - File Manager
   - phpMyAdmin

### Pro Tips

1. **Always test locally first** using XAMPP/WAMP
2. **Use error logs** - check error.log regularly
3. **Set permissions correctly** - 644 for files, 755 for dirs
4. **Keep backups** - download before making changes
5. **Use absolute URLs** in your code when possible
6. **Clear browser cache** when testing
7. **Wait for DNS** - be patient with domain propagation

### Contact Support

If all else fails:
- InfinityFree Forum: https://forum.infinityfree.net/
- Support Ticket: Via control panel
- Community: Discord/Reddit

Always include:
- Account username
- Domain name
- Specific error message
- What you've already tried
