# 📥 Panduan Download Platform

## Cara Download Semua File Platform Deployment

Karena Anda tidak bisa download ZIP atau git clone, ikuti salah satu metode berikut:

---

## ✅ Metode 1: Download File Manual (PALING MUDAH)

### Langkah-langkah:

1. **Buka halaman branch ini:**
   ```
   https://github.com/WildanAlfiyandi/WildanAlfiyandi.github.io/tree/copilot/create-website-deployment-feature
   ```

2. **Download file satu per satu:**
   
   Untuk setiap file di bawah ini:
   - Klik nama file
   - Klik tombol **"Raw"** (di kanan atas)
   - Klik kanan → **"Save As"** atau tekan **Ctrl+S**
   - Simpan dengan nama yang sama

### 📄 Daftar File yang Harus Didownload:

**File PHP Utama (WAJIB):**
- [ ] `deploy.php` - Interface utama
- [ ] `upload.php` - Handler upload
- [ ] `file-manager.php` - File manager
- [ ] `settings.php` - Admin settings
- [ ] `activity-log.php` - Activity log
- [ ] `config.php` - Configuration

**File Database & Config (WAJIB):**
- [ ] `database.sql` - Database schema
- [ ] `.htaccess` - Apache config

**File Template (OPSIONAL):**
- [ ] `demo-site.html` - Demo template
- [ ] `test-website.html` - Test template

**File Dokumentasi (PENTING):**
- [ ] `STEP-BY-STEP-INFINITYFREE.md` - Panduan upload
- [ ] `INFINITYFREE-SETUP.md` - Setup guide
- [ ] `FEATURES-COMPLETE.md` - Feature list
- [ ] `README.md` - Overview

**File Lain (OPSIONAL):**
- [ ] `.gitignore` - Git ignore

---

## ✅ Metode 2: Copy-Paste Code (ALTERNATIF)

Jika tidak bisa download, buat file baru di komputer dan copy-paste kode:

### Contoh untuk `deploy.php`:

1. **Buka file di GitHub:**
   ```
   https://github.com/WildanAlfiyandi/WildanAlfiyandi.github.io/blob/copilot/create-website-deployment-feature/deploy.php
   ```

2. **Klik tombol "Raw"** (pojok kanan atas)

3. **Select All (Ctrl+A)** → **Copy (Ctrl+C)**

4. **Buat file baru di komputer:**
   - Buka Notepad++ atau editor text
   - Paste code (Ctrl+V)
   - Save As → `deploy.php`
   - **PENTING:** Pilih encoding **UTF-8** dan type **PHP file**

5. **Ulangi untuk semua file lain**

---

## ✅ Metode 3: Gunakan GitHub CLI (untuk yang familiar terminal)

```bash
# Install GitHub CLI
# Download dari: https://cli.github.com/

# Login
gh auth login

# Clone repository
gh repo clone WildanAlfiyandi/WildanAlfiyandi.github.io

# Checkout branch
cd WildanAlfiyandi.github.io
git checkout copilot/create-website-deployment-feature
```

---

## ✅ Metode 4: Download via Web Archive (BACKUP METHOD)

1. **Kunjungi:**
   ```
   https://github.com/WildanAlfiyandi/WildanAlfiyandi.github.io/archive/refs/heads/copilot/create-website-deployment-feature.zip
   ```

2. **Jika link di atas tidak work, coba:**
   ```
   https://codeload.github.com/WildanAlfiyandi/WildanAlfiyandi.github.io/zip/refs/heads/copilot/create-website-deployment-feature
   ```

---

## 📁 Struktur Folder Setelah Download

Buat struktur folder seperti ini di komputer Anda:

```
deployment-platform/
├── deploy.php
├── upload.php
├── file-manager.php
├── settings.php
├── activity-log.php
├── config.php
├── database.sql
├── .htaccess
├── .gitignore
├── demo-site.html
├── test-website.html
├── deployments/ (buat folder kosong)
├── assets/ (buat folder kosong)
└── backups/ (buat folder kosong)
```

---

## 📤 Upload ke InfinityFree

Setelah semua file terdownload:

1. **Buka FileZilla** (download dari https://filezilla-project.org/)

2. **Connect ke InfinityFree:**
   - Host: `ftpupload.net`
   - Username: `epiz_xxxxx` (dari control panel)
   - Password: (dari control panel)
   - Port: `21`

3. **Upload semua file ke folder `htdocs/`**

4. **Buat folder tambahan:**
   - `htdocs/deployments/` (chmod 755)
   - `htdocs/assets/` (chmod 755)
   - `htdocs/backups/` (chmod 755)

5. **Import database:**
   - Buka phpMyAdmin di InfinityFree
   - Import file `database.sql`

6. **Edit `config.php`:**
   - Update DB credentials
   - Update domain ke `kiosmurah.me`

7. **Tes akses:**
   ```
   http://kiosmurah.me/deploy.php
   Login: admin / admin123
   ```

---

## ❓ Troubleshooting

### "Tidak bisa download file dari GitHub"

**Solusi:**
1. Pastikan Anda login ke GitHub
2. Coba browser lain (Chrome, Firefox, Edge)
3. Disable ad blocker
4. Clear browser cache
5. Gunakan metode Copy-Paste (Metode 2)

### "Git clone tidak berhasil"

**Solusi:**
1. Install Git terlebih dahulu: https://git-scm.com/
2. Restart terminal/command prompt
3. Pastikan koneksi internet stabil
4. Gunakan metode download manual (Metode 1)

### "File terdownload tapi corrupt/rusak"

**Solusi:**
1. Download ulang file tersebut
2. Pastikan save as dengan extension yang benar (.php, .sql, dll)
3. Jangan buka file dengan double-click, edit dengan text editor

---

## 📞 Butuh Bantuan?

Jika masih kesulitan download:

1. **Screenshot error yang Anda dapat**
2. **Comment di PR dengan detail:**
   - Browser yang digunakan
   - Error message yang muncul
   - Metode download yang sudah dicoba

---

## ✅ Checklist Lengkap

Sebelum upload ke InfinityFree, pastikan Anda punya:

- [ ] Semua 6 file PHP utama terdownload
- [ ] File `database.sql` terdownload
- [ ] File `.htaccess` terdownload
- [ ] File `config.php` terdownload
- [ ] Panduan `STEP-BY-STEP-INFINITYFREE.md` terbaca
- [ ] Akun InfinityFree sudah dibuat
- [ ] Domain kiosmurah.me sudah disetup
- [ ] FileZilla sudah terinstall
- [ ] FTP credentials InfinityFree sudah dicatat

---

## 🚀 Siap Upload!

Jika semua checklist di atas sudah ✅, Anda siap upload ke InfinityFree!

Ikuti panduan lengkap di file: **STEP-BY-STEP-INFINITYFREE.md**

Good luck! 🎉
