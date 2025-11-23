# 🚀 Panduan Setup di InfinityFree

## Langkah-langkah Instalasi di InfinityFree Hosting

### 1. Persiapan Akun InfinityFree

1. **Daftar/Login ke InfinityFree**
   - Kunjungi https://infinityfree.net
   - Buat akun gratis atau login
   - Buat hosting baru dengan domain kiosmurah.me

2. **Setup Database MySQL**
   - Masuk ke Control Panel InfinityFree
   - Buka **MySQL Databases**
   - Buat database baru (catat nama database, username, dan password)
   - Buka **phpMyAdmin**

### 2. Upload Files

**Metode 1: File Manager**
1. Masuk ke Control Panel → **Online File Manager**
2. Navigate ke folder `htdocs`
3. Upload semua file PHP ke `htdocs`
4. Pastikan struktur folder:
   ```
   htdocs/
   ├── deploy.php
   ├── upload.php
   ├── file-manager.php
   ├── settings.php
   ├── config.php
   ├── .htaccess
   ├── deployments/
   ├── assets/
   └── backups/
   ```

**Metode 2: FTP (Lebih Cepat)**
1. Download FTP Client (FileZilla recommended)
2. Gunakan kredensial FTP dari InfinityFree:
   - Host: ftpupload.net atau ftp.yourdomain.com
   - Username: epiz_xxxxx
   - Password: (dari email InfinityFree)
   - Port: 21
3. Upload semua file ke folder `htdocs`

### 3. Konfigurasi Database

1. **Import Database**
   - Buka phpMyAdmin di InfinityFree
   - Pilih database yang sudah dibuat
   - Klik tab **Import**
   - Upload file `database.sql`
   - Klik **Go**

2. **Update config.php**
   - Edit file `config.php` di line 10-13:
   ```php
   define('DB_HOST', 'sql123.infinityfree.com'); // Ganti dengan host MySQL Anda
   define('DB_USER', 'epiz_xxxxx_dbuser'); // Username database Anda
   define('DB_PASS', 'your_password'); // Password database Anda
   define('DB_NAME', 'epiz_xxxxx_kiosmurah'); // Nama database Anda
   ```

3. **Update Domain di config.php** (line 24):
   ```php
   define('BASE_DOMAIN', 'kiosmurah.me'); // Domain Anda
   ```

### 4. Set Permissions

Pada InfinityFree, set permissions untuk folder:
- `deployments/` → 755
- `assets/` → 755
- `backups/` → 755

Cara set permission di File Manager:
1. Right-click folder
2. Pilih **Change Permissions**
3. Set ke 755

### 5. Test Platform

1. **Akses Website**
   - Buka browser: `http://kiosmurah.me/deploy.php`
   - Atau: `http://yourusername.infinityfreeapp.com/deploy.php`

2. **Login**
   - Username: `admin`
   - Password: `admin123`

3. **Test Upload**
   - Upload file HTML/CSS/JS
   - Pastikan deployment berhasil
   - Akses deployed site di: `kiosmurah.me/deployments/deploy-xxxxx/`

### 6. Konfigurasi Custom Domain

Jika menggunakan domain kiosmurah.me:

1. **Update DNS Records**
   - Masuk ke domain registrar Anda
   - Update DNS Records:
     ```
     Type: A
     Name: @
     Value: [IP InfinityFree dari control panel]
     
     Type: CNAME
     Name: www
     Value: kiosmurah.me
     ```

2. **Setup di InfinityFree**
   - Control Panel → **Addon Domains**
   - Tambahkan domain: kiosmurah.me
   - Tunggu DNS propagation (24-48 jam)

### 7. Admin Settings

Setelah login, akses settings:
1. Klik menu **Settings** atau buka `settings.php`
2. Konfigurasi:
   - **General**: Platform name, maintenance mode
   - **Domain**: Base domain, deployment URL format
   - **Appearance**: Theme, logo
   - **Upload**: Max file size (InfinityFree limit: 10MB per file)
   - **Security**: Password, login attempts
   - **Advanced**: System info, maintenance

### 8. Optimasi untuk InfinityFree

**Batasan InfinityFree:**
- Max file upload: 10MB
- PHP memory limit: 256MB
- No cron jobs
- Limited CPU usage

**Recommended Settings:**
```php
// Di config.php, update:
define('MAX_FILE_SIZE', 10 * 1024 * 1024); // 10MB
define('INFINITYFREE_MODE', true);
```

### 9. Security Best Practices

1. **Ganti Password Default**
   - Login → Settings → Security
   - Change password dari admin123

2. **Enable .htaccess Protection**
   - File `.htaccess` sudah disertakan
   - Pastikan aktif di InfinityFree

3. **Backup Regular**
   - Download deployments via FTP
   - Backup database via phpMyAdmin

### 10. Troubleshooting

**Upload Error:**
- Check file size < 10MB
- Check folder permissions (755)
- Check PHP error log di InfinityFree

**Database Connection Error:**
- Verify DB credentials di config.php
- Check database status di control panel
- Pastikan DB user punya akses ke database

**404 Not Found:**
- Check .htaccess aktif
- Verify mod_rewrite enabled
- Check file paths correct

**Deploy URL tidak berfungsi:**
- Check deployments/ folder exists
- Verify permissions 755
- Check .htaccess rules

### 11. URL Deployed Sites

Setelah deploy, website dapat diakses di:
- Format 1: `kiosmurah.me/deployments/deploy-xxxxx/`
- Format 2 (dengan custom domain): `site-name.kiosmurah.me/`

### 12. Fitur-fitur Platform

✅ **Multi-file Upload**: Upload banyak file sekaligus
✅ **ZIP Extraction**: Upload ZIP dan extract otomatis
✅ **File Manager**: Kelola file deployed
✅ **Custom Domain**: Support custom domain
✅ **Theme Customization**: 6 tema warna
✅ **Logo Upload**: Custom branding
✅ **Statistics**: Real-time stats
✅ **Security**: CSRF protection, password hashing
✅ **Responsive UI**: Mobile-friendly
✅ **Admin Panel**: Comprehensive settings

### 13. Support & Documentation

- **README.md**: Dokumentasi Inggris
- **PANDUAN.md**: Panduan Bahasa Indonesia  
- **DEPLOYMENT.md**: Setup guide lengkap
- **TESTING-SUMMARY.md**: Test results

### 14. Demo Credentials

Default login:
- Username: `admin`
- Email: `admin@kiosmurah.me`
- Password: `admin123`

⚠️ **PENTING**: Ganti password setelah first login!

### 15. Next Steps

Setelah setup berhasil:
1. ✅ Ganti password admin
2. ✅ Upload logo custom di Settings
3. ✅ Pilih theme favorit
4. ✅ Test upload beberapa website
5. ✅ Configure custom domain (optional)
6. ✅ Setup backup schedule

---

## 🎉 Platform Siap Digunakan!

Akses dashboard: `http://kiosmurah.me/deploy.php`

**Fitur Utama:**
- Deploy unlimited websites
- Support 35+ file types
- Modern glass-morphism UI
- Animated backgrounds
- Real-time statistics
- Advanced file manager
- Custom domain support
- Responsive design

**Support InfinityFree:** ✅ Fully compatible

---

Jika ada pertanyaan atau error, check:
1. PHP error logs di InfinityFree control panel
2. Browser console untuk JavaScript errors
3. Database connection status
4. File permissions

Good luck! 🚀
