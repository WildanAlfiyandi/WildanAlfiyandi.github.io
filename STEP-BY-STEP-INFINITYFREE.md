# 📝 Panduan Lengkap Upload ke InfinityFree & kiosmurah.me

## 🎯 Step-by-Step Upload Platform ke InfinityFree

### Step 1: Persiapan Akun InfinityFree

1. **Buat Akun InfinityFree**
   - Kunjungi: https://infinityfree.net
   - Klik "Sign Up" (pojok kanan atas)
   - Isi form registrasi:
     - Email address
     - Password
     - Centang "I accept the Terms of Service"
   - Klik "Create Account"
   - Verifikasi email Anda

2. **Buat Hosting Baru**
   - Login ke InfinityFree
   - Klik "Create Account" di dashboard
   - Pilih domain:
     - **Option 1**: Gunakan subdomain gratis (kiosmurah.infinityfreeapp.com)
     - **Option 2**: Gunakan custom domain (kiosmurah.me) - **RECOMMENDED**
   - Isi form:
     - Username: pilih username unik
     - Domain: kiosmurah.me (jika punya domain)
     - Password: buat password kuat
   - Klik "Create Account"
   - Tunggu setup selesai (1-5 menit)

### Step 2: Setup Domain kiosmurah.me

**Jika menggunakan domain custom (kiosmurah.me):**

1. **Login ke Domain Registrar**
   - Login ke tempat Anda beli domain (Namecheap, GoDaddy, Cloudflare, dll)

2. **Update DNS Records**
   - Cari menu "DNS Management" atau "DNS Settings"
   - Tambahkan/Update A Record:
     ```
     Type: A
     Host: @ (atau kosongkan)
     Value: 185.27.134.10 (IP dari InfinityFree control panel)
     TTL: Automatic atau 3600
     ```
   - Tambahkan/Update CNAME Record:
     ```
     Type: CNAME
     Host: www
     Value: kiosmurah.me
     TTL: Automatic atau 3600
     ```
   - **PENTING**: IP address bisa berbeda, check di InfinityFree control panel Anda!

3. **Tunggu DNS Propagation**
   - Biasanya 1-48 jam
   - Check status: https://www.whatsmydns.net

### Step 3: Upload Files via FTP

**Metode 1: Menggunakan FileZilla (RECOMMENDED)**

1. **Download & Install FileZilla**
   - Download: https://filezilla-project.org/
   - Install FileZilla Client

2. **Dapatkan FTP Credentials**
   - Login ke InfinityFree control panel
   - Klik account Anda
   - Lihat section "FTP Details":
     ```
     FTP Hostname: ftpupload.net
     FTP Username: epiz_xxxxx (catat ini)
     FTP Password: (lihat di control panel)
     FTP Port: 21
     ```

3. **Connect via FileZilla**
   - Buka FileZilla
   - Isi di bagian atas:
     - Host: `ftpupload.net`
     - Username: `epiz_xxxxx` (dari control panel)
     - Password: (dari control panel)
     - Port: `21`
   - Klik "Quickconnect"
   - Jika diminta "Unknown certificate", klik "OK"

4. **Navigate ke htdocs**
   - Di panel kanan (Remote site), double-click folder `htdocs`
   - Ini adalah root directory website Anda

5. **Upload Files Platform**
   - Di panel kiri (Local site), navigate ke folder platform Anda
   - Select semua file:
     ```
     deploy.php
     upload.php
     file-manager.php
     settings.php
     config.php
     database.sql
     .htaccess
     .gitignore
     index.html
     demo-site.html
     test-website.html
     README.md
     DEPLOYMENT.md
     PANDUAN.md
     INFINITYFREE-SETUP.md
     FEATURES-COMPLETE.md
     TESTING-SUMMARY.md
     PROJECT-SUMMARY.md
     ```
   - Drag & drop ke panel kanan (htdocs folder)
   - Tunggu upload selesai (5-15 menit tergantung koneksi)

6. **Upload Folders**
   - Upload folder `deployments/` (pastikan ada .gitkeep di dalamnya)
   - Buat folder `assets/` dan `backups/` jika belum ada

**Metode 2: Menggunakan Online File Manager**

1. Login ke InfinityFree control panel
2. Klik "File Manager"
3. Navigate ke `htdocs`
4. Klik "Upload" button
5. Select files dari komputer Anda
6. Upload satu per satu atau zip semua files dulu

### Step 4: Setup Database MySQL

1. **Buat Database**
   - Login ke InfinityFree control panel
   - Klik "MySQL Databases"
   - Buat database baru:
     - Database Name: `kiosmurah` (atau nama lain)
     - Klik "Create Database"
   - Catat credentials:
     ```
     Database Name: epiz_xxxxx_kiosmurah
     Database Username: epiz_xxxxx
     Database Password: (catat ini!)
     Database Host: sql123.infinityfree.com (atau similar)
     ```

2. **Import database.sql**
   - Klik "PhpMyAdmin" di control panel
   - Login dengan credentials database
   - Select database Anda (epiz_xxxxx_kiosmurah)
   - Klik tab "Import"
   - Klik "Choose File"
   - Select file `database.sql` dari komputer
   - Scroll ke bawah, klik "Go"
   - Tunggu import selesai

3. **Verify Tables**
   - Klik tab "Structure"
   - Pastikan tables ada:
     - settings
     - users
     - deployments
     - files
     - activity_log
     - api_keys

### Step 5: Konfigurasi config.php

1. **Edit config.php via File Manager**
   - Buka File Manager di InfinityFree
   - Navigate ke `htdocs/config.php`
   - Klik kanan → Edit atau Code Edit

2. **Update Database Credentials** (Line 10-13):
   ```php
   define('DB_HOST', 'sql123.infinityfree.com'); // Ganti dengan host Anda
   define('DB_USER', 'epiz_xxxxx'); // Username database Anda
   define('DB_PASS', 'your_db_password'); // Password database Anda
   define('DB_NAME', 'epiz_xxxxx_kiosmurah'); // Nama database Anda
   ```

3. **Update Domain Configuration** (Line 24):
   ```php
   define('BASE_DOMAIN', 'kiosmurah.me'); // Domain Anda
   ```

4. **Set InfinityFree Mode** (Line 75):
   ```php
   define('INFINITYFREE_MODE', true); // Enable compatibility
   ```

5. **Update Upload Limits** (Line 31):
   ```php
   define('MAX_FILE_SIZE', 10 * 1024 * 1024); // 10MB untuk InfinityFree
   ```

6. **Save Changes**
   - Klik "Save Changes" atau Ctrl+S
   - Close editor

### Step 6: Set File Permissions

1. **Via File Manager:**
   - Klik kanan pada folder → Change Permissions
   - Set permissions:
     ```
     deployments/ → 755 (rwxr-xr-x)
     assets/ → 755 (rwxr-xr-x)
     backups/ → 755 (rwxr-xr-x)
     config.php → 644 (rw-r--r--)
     ```

2. **Via FileZilla:**
   - Klik kanan folder → File Permissions
   - Numeric value: 755
   - Centang "Recurse into subdirectories"
   - Klik OK

### Step 7: Test Platform

1. **Akses Website**
   - Buka browser
   - Kunjungi: `http://kiosmurah.me/deploy.php`
   - Atau: `http://kiosmurah.infinityfreeapp.com/deploy.php`

2. **Login**
   - Username: `admin`
   - Password: `admin123`
   - Klik "Login"

3. **Verify Dashboard**
   - Pastikan dashboard tampil dengan baik
   - Check statistics cards (Total Deployments, dll)
   - Verify upload area muncul

### Step 8: Configure Settings

1. **Klik Settings Button**
   - Di dashboard, klik "Settings" (pojok kanan atas)

2. **General Settings**
   - Platform Name: `Kios Murah Deployment`
   - Save

3. **Domain Settings**
   - Base Domain: `kiosmurah.me`
   - Deployment URL Format: pilih yang sesuai
   - Save

4. **Appearance**
   - Pilih theme favorit (Purple, Blue, Green, dll)
   - Upload logo (optional)
   - Save

5. **Security**
   - **PENTING**: Change password!
   - Old Password: `admin123`
   - New Password: (password baru yang kuat)
   - Confirm Password: (ulangi password baru)
   - Save

### Step 9: Test Upload Website

1. **Kembali ke Dashboard**
   - Klik "Back to Dashboard"

2. **Test Upload File**
   - Klik "Browse Files" atau drag & drop
   - Upload test HTML file
   - Klik "Deploy Website"
   - Tunggu proses selesai

3. **Verify Deployment**
   - Check di "Your Deployments"
   - Klik "View" untuk melihat deployed site
   - URL akan seperti: `kiosmurah.me/deployments/deploy-xxxxx/`

### Step 10: Optimization & Maintenance

1. **Enable Caching**
   - File `.htaccess` sudah include caching rules
   - Verify aktif di InfinityFree

2. **Monitor Usage**
   - Check disk space di InfinityFree control panel
   - InfinityFree limit: 5GB
   - Monitor bandwidth

3. **Regular Backup**
   - Download files via FTP seminggu sekali
   - Export database via phpMyAdmin
   - Simpan di local/cloud storage

4. **Update Platform**
   - Check GitHub untuk updates
   - Download versi terbaru
   - Upload via FTP (overwrite files lama)

## 🔧 Troubleshooting

### Error: "Cannot connect to database"
**Solusi:**
1. Verify DB credentials di `config.php`
2. Check database status di InfinityFree control panel
3. Pastikan database user punya akses ke database

### Error: "Permission denied"
**Solusi:**
1. Set folder permissions ke 755
2. Set file permissions ke 644
3. Clear browser cache

### Error: "Upload failed"
**Solusi:**
1. Check file size < 10MB
2. Verify MIME type allowed
3. Check disk space di InfinityFree

### DNS tidak resolve
**Solusi:**
1. Tunggu 24-48 jam untuk DNS propagation
2. Check DNS settings di domain registrar
3. Verify A record pointing ke IP yang benar

### 404 Not Found
**Solusi:**
1. Verify `.htaccess` ada di htdocs
2. Check mod_rewrite enabled
3. Pastikan file ada di htdocs folder

## 📊 Checklist Lengkap

### Pre-Deployment
- [ ] Akun InfinityFree dibuat
- [ ] Domain kiosmurah.me ready (atau gunakan subdomain)
- [ ] FileZilla/FTP client installed
- [ ] Files platform siap

### Upload Process
- [ ] Files uploaded via FTP
- [ ] Database created
- [ ] database.sql imported
- [ ] config.php updated dengan DB credentials
- [ ] Domain configured
- [ ] Permissions set correctly

### Configuration
- [ ] config.php DB settings correct
- [ ] BASE_DOMAIN set to kiosmurah.me
- [ ] INFINITYFREE_MODE enabled
- [ ] Upload limits set to 10MB

### Testing
- [ ] Can access deploy.php
- [ ] Login works
- [ ] Dashboard displays correctly
- [ ] Can upload files
- [ ] Deployment works
- [ ] Can view deployed sites
- [ ] File manager functional
- [ ] Settings panel accessible

### Security
- [ ] Password changed from default
- [ ] HTTPS enabled (via Cloudflare or similar)
- [ ] .htaccess security headers active
- [ ] Database credentials secure

### Post-Deployment
- [ ] Theme selected
- [ ] Logo uploaded
- [ ] Settings configured
- [ ] Test deployment created
- [ ] Backup schedule set

## 🎉 Success!

Jika semua checklist di atas ✅, platform Anda sudah siap digunakan di:

**URL Platform:** `https://kiosmurah.me/deploy.php`
**Deployed Sites:** `https://kiosmurah.me/deployments/site-name/`

**Selamat! Platform deployment Anda sudah online! 🚀**

---

## 💡 Tips Pro

1. **Gunakan Cloudflare** untuk HTTPS gratis dan CDN
2. **Enable Auto Backup** di Settings → Advanced
3. **Monitor Analytics** untuk track deployments
4. **Set Strong Password** untuk security
5. **Regular Updates** check GitHub untuk versi baru

---

**Need Help?** Check:
- INFINITYFREE-SETUP.md
- FEATURES-COMPLETE.md  
- TESTING-SUMMARY.md
- atau buka issue di GitHub
