# SMM Panel Premium - Panduan Build APK

## 🚀 Tentang Aplikasi

SMM Panel Premium adalah aplikasi Progressive Web App (PWA) untuk layanan Social Media Marketing dengan fitur-fitur unik:

### ✨ Fitur Utama
- **UI/UX Modern** - Glassmorphism design dengan animasi smooth
- **User Dashboard** - Kelola order, deposit, dan tiket support
- **Admin Panel** - Manajemen lengkap users, orders, services
- **Real-time Updates** - Notifikasi dan update status secara real-time
- **Offline Support** - Dapat diakses tanpa internet (PWA)
- **Database Lokal** - IndexedDB untuk penyimpanan data

### 🎨 Fitur Visual Unik
- Animated background dengan gradient orbs
- Glassmorphism cards dengan blur effect
- Smooth page transitions
- Loading animations
- Particle effects pada splash screen
- Responsive design untuk semua device

---

## 📱 Cara Build APK

### Metode 1: PWABuilder (Termudah - Direkomendasikan)

1. **Deploy ke hosting**
   - Upload folder `smm-panel` ke GitHub Pages atau hosting lain
   - Pastikan bisa diakses via HTTPS

2. **Buka PWABuilder**
   - Kunjungi https://www.pwabuilder.com/
   - Masukkan URL aplikasi Anda
   - Klik "Start"

3. **Generate APK**
   - Pilih tab "Android"
   - Klik "Generate" untuk membuat APK
   - Download file APK yang dihasilkan

4. **Install di Android**
   - Transfer APK ke device Android
   - Enable "Install from Unknown Sources"
   - Install APK

---

### Metode 2: Bubblewrap CLI

#### Prerequisites
- Node.js v14+
- Java JDK 8+
- Android SDK

#### Langkah-langkah

1. **Install Bubblewrap**
```bash
npm install -g @anthropic/bubblewrap
```

2. **Inisialisasi Project**
```bash
bubblewrap init --manifest https://yoursite.com/smm-panel/manifest.json
```

3. **Build APK**
```bash
bubblewrap build
```

4. **Output**
   - File APK akan ada di folder `app-release-signed.apk`

---

### Metode 3: Apache Cordova

#### Prerequisites
- Node.js
- Cordova CLI
- Android SDK

#### Langkah-langkah

1. **Install Cordova**
```bash
npm install -g cordova
```

2. **Buat Project Cordova**
```bash
cordova create smm-panel-app com.yourname.smmpanel "SMM Panel"
cd smm-panel-app
```

3. **Copy Files**
   - Copy semua file dari folder `smm-panel` ke folder `www`

4. **Tambah Platform Android**
```bash
cordova platform add android
```

5. **Build APK**
```bash
cordova build android --release
```

6. **Sign APK**
```bash
# Generate keystore
keytool -genkey -v -keystore smmpanel.keystore -alias smmpanel -keyalg RSA -keysize 2048 -validity 10000

# Sign APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore smmpanel.keystore app-release-unsigned.apk smmpanel

# Align APK
zipalign -v 4 app-release-unsigned.apk smmpanel.apk
```

---

### Metode 4: Capacitor (by Ionic)

#### Prerequisites
- Node.js
- Android Studio

#### Langkah-langkah

1. **Install Capacitor**
```bash
npm install @capacitor/core @capacitor/cli
npx cap init "SMM Panel" "com.yourname.smmpanel"
```

2. **Copy Web Assets**
```bash
# Edit capacitor.config.json
{
  "webDir": "smm-panel"
}
```

3. **Tambah Platform Android**
```bash
npx cap add android
npx cap sync
```

4. **Buka di Android Studio**
```bash
npx cap open android
```

5. **Build APK**
   - Di Android Studio: Build > Build Bundle(s) / APK(s) > Build APK(s)

---

## 🔧 Konfigurasi Tambahan

### Mengubah Package Name
Edit file `manifest.json`:
```json
{
  "name": "Nama Aplikasi Anda",
  "short_name": "SMM",
  "start_url": "/",
  ...
}
```

### Mengubah Ikon Aplikasi
1. Siapkan ikon dalam berbagai ukuran:
   - 72x72, 96x96, 128x128, 144x144
   - 152x152, 192x192, 384x384, 512x512
2. Simpan di folder `icons/`
3. Update path di `manifest.json`

### Mengubah Splash Screen
Edit `css/animations.css`:
```css
.splash-screen {
  background: linear-gradient(135deg, #yourcolor1, #yourcolor2);
}
```

### Mengubah Tema Warna
Edit `css/main.css`:
```css
:root {
  --primary: #yourcolor;
  --secondary: #yourcolor;
  ...
}
```

---

## 🌐 Hosting & Deployment

### GitHub Pages (Gratis)

1. Push ke repository GitHub
2. Settings > Pages > Enable
3. URL: `https://username.github.io/repo-name/smm-panel/`

### Netlify (Gratis)

1. Connect repository ke Netlify
2. Deploy otomatis setiap push
3. Custom domain support

### Vercel (Gratis)

1. Import project dari GitHub
2. Deploy otomatis
3. HTTPS otomatis

---

## 📝 Demo Akun

| Role  | Username | Password  |
|-------|----------|-----------|
| Admin | admin    | admin123  |
| User  | user     | user123   |
| Demo  | demo     | demo123   |

---

## 🛠️ Troubleshooting

### APK tidak terinstall
- Pastikan "Install from Unknown Sources" sudah diaktifkan
- Cek versi Android (minimal Android 5.0)

### PWA tidak terinstall
- Pastikan site menggunakan HTTPS
- Periksa manifest.json valid
- Cek service worker terdaftar

### Offline tidak bekerja
- Clear cache browser
- Re-register service worker
- Pastikan semua assets tercache

---

## 📞 Support

Jika mengalami kendala, silakan buat issue di repository atau hubungi developer.

---

## 📜 Lisensi

MIT License - Bebas digunakan dan dimodifikasi.

---

**Happy Coding! 🎉**
