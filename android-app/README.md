# Deployment Platform - Android Application

Aplikasi Android untuk mengakses Professional Deployment Platform.

## Deskripsi

Aplikasi ini adalah WebView wrapper untuk website [WildanAlfiyandi.github.io](https://wildanalfiyandi.github.io/). Aplikasi ini memungkinkan pengguna untuk mengakses platform deployment melalui aplikasi Android native.

## Fitur

- 🌐 WebView terintegrasi untuk mengakses website
- 📱 Antarmuka native Android
- 🔄 Dukungan navigasi back button
- 🔒 Akses aman dengan HTTPS
- 💾 Penyimpanan DOM untuk JavaScript
- 📲 Support untuk semua fitur website

## Persyaratan Sistem

- Android 5.0 (API level 21) atau lebih tinggi
- Koneksi internet aktif
- Minimal 50 MB ruang penyimpanan

## Cara Build Aplikasi

### Prasyarat

1. Install [Android Studio](https://developer.android.com/studio)
2. Install JDK 8 atau lebih tinggi
3. Install Android SDK dengan API level 34

### Langkah-langkah Build

1. Clone repository ini:
   ```bash
   git clone https://github.com/WildanAlfiyandi/WildanAlfiyandi.github.io.git
   ```

2. Buka Android Studio dan pilih "Open an Existing Project"

3. Navigate ke folder `android-app` di dalam repository

4. Tunggu hingga Gradle sync selesai

5. Build aplikasi:
   - Untuk build debug: `Build > Build Bundle(s) / APK(s) > Build APK(s)`
   - Untuk build release: `Build > Generate Signed Bundle / APK`

6. APK akan tersedia di `android-app/app/build/outputs/apk/`

### Build via Command Line

Jika Anda lebih suka menggunakan command line:

```bash
cd android-app
./gradlew assembleDebug
```

APK debug akan tersedia di `app/build/outputs/apk/debug/app-debug.apk`

Untuk build release:

```bash
./gradlew assembleRelease
```

## Instalasi

1. Download file APK dari releases atau build sendiri
2. Enable "Install from Unknown Sources" di pengaturan Android Anda
3. Install APK di perangkat Android Anda
4. Buka aplikasi dan nikmati!

## Penggunaan

1. Buka aplikasi "Deployment Platform"
2. Aplikasi akan otomatis memuat website
3. Login menggunakan kredensial:
   - Username: `admin`
   - Password: `admin123`
4. Gunakan semua fitur platform deployment

## Struktur Proyek

```
android-app/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/wildanalfiyandi/deploymentplatform/
│   │       │   └── MainActivity.java
│   │       ├── res/
│   │       │   ├── layout/
│   │       │   │   └── activity_main.xml
│   │       │   └── values/
│   │       │       ├── strings.xml
│   │       │       └── styles.xml
│   │       └── AndroidManifest.xml
│   ├── build.gradle
│   └── proguard-rules.pro
├── gradle/
│   └── wrapper/
│       └── gradle-wrapper.properties
├── build.gradle
├── settings.gradle
├── gradle.properties
└── README.md
```

## Teknologi yang Digunakan

- **Language**: Java
- **Min SDK**: 21 (Android 5.0 Lollipop)
- **Target SDK**: 34 (Android 14)
- **Build System**: Gradle
- **WebView**: Android WebView dengan JavaScript enabled

## Kontribusi

Kontribusi sangat diterima! Silakan:

1. Fork repository
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan Anda (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## Lisensi

Proyek ini dibuat untuk keperluan pembelajaran dan portfolio.

## Kontak

Wildan Alfiyandi - [GitHub](https://github.com/WildanAlfiyandi)

Project Link: [https://github.com/WildanAlfiyandi/WildanAlfiyandi.github.io](https://github.com/WildanAlfiyandi/WildanAlfiyandi.github.io)

## Catatan

- Aplikasi ini memerlukan koneksi internet untuk berfungsi
- Pastikan website [https://wildanalfiyandi.github.io/](https://wildanalfiyandi.github.io/) dapat diakses
- Untuk pengalaman terbaik, gunakan jaringan WiFi atau 4G/5G yang stabil
