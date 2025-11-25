# 🚀 SMM Panel - Android APK Source Code

Ini adalah source code lengkap untuk aplikasi **SMM Panel** Android native.

## 📋 Informasi Aplikasi

- **Nama App:** SMM Panel
- **Package:** com.smmpanel.app
- **Min SDK:** 21 (Android 5.0)
- **Target SDK:** 34 (Android 14)
- **Version:** 1.0.0

## 🔐 Login Credentials

```
Username: admin
Password: admin2024
```

## ✨ Fitur

1. **Login System** - Autentikasi dengan username/password
2. **Dashboard** - Statistik orders, users, revenue, services
3. **Order Management** - Lihat dan kelola semua pesanan
4. **User Management** - Kelola data pengguna
5. **Service Catalog** - Daftar layanan SMM (Instagram, Facebook, YouTube, dll)
6. **Modern UI** - Desain material dengan gradient dan cards

## 📁 Struktur Project

```
android-smm-panel/
├── app/
│   ├── build.gradle
│   ├── proguard-rules.pro
│   └── src/main/
│       ├── AndroidManifest.xml
│       ├── java/com/smmpanel/app/
│       │   ├── LoginActivity.java
│       │   ├── MainActivity.java
│       │   ├── OrderActivity.java
│       │   ├── ServiceActivity.java
│       │   └── UserActivity.java
│       └── res/
│           ├── drawable/
│           ├── layout/
│           └── values/
├── build.gradle
├── settings.gradle
└── gradle.properties
```

## 🔨 Cara Build APK

### Metode 1: Android Studio (Recommended)

1. **Download/Clone repository ini**
2. **Buka Android Studio**
3. **File → Open → pilih folder `android-smm-panel`**
4. **Tunggu Gradle sync selesai**
5. **Build → Build Bundle(s)/APK(s) → Build APK(s)**
6. **APK ada di: `app/build/outputs/apk/debug/app-debug.apk`**

### Metode 2: Command Line (Gradle)

```bash
cd android-smm-panel
./gradlew assembleDebug
# APK di: app/build/outputs/apk/debug/app-debug.apk
```

### Metode 3: Termux (Android)

```bash
# Install dependencies
pkg update && pkg upgrade
pkg install openjdk-17 gradle

# Clone/download project
cd android-smm-panel

# Build APK
gradle assembleDebug

# APK location
ls app/build/outputs/apk/debug/
```

### Metode 4: GitHub Actions (CI/CD)

Tambahkan file `.github/workflows/android.yml`:

```yaml
name: Android CI

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
    - name: Build APK
      run: |
        cd android-smm-panel
        chmod +x gradlew
        ./gradlew assembleDebug
    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: app-debug
        path: android-smm-panel/app/build/outputs/apk/debug/app-debug.apk
```

## 🛠️ Requirements untuk Build

- **Java JDK 11 atau lebih baru** (recommended: JDK 17)
- **Android SDK** dengan API level 34
- **Gradle 8.0**
- **Minimum 4GB RAM**
- **Disk space 2GB+**

## 📲 Install APK

1. **Enable "Unknown Sources"** di Settings → Security
2. **Transfer APK** ke device
3. **Tap file APK** untuk install
4. **Buka app SMM Panel**
5. **Login dengan admin/admin2024**

## 🔧 Customization

### Ganti Credentials
Edit file `LoginActivity.java`:
```java
private static final String ADMIN_USERNAME = "admin";
private static final String ADMIN_PASSWORD = "admin2024";
```

### Ganti Package Name
1. Edit `app/build.gradle`: `applicationId "com.smmpanel.app"`
2. Rename folder `java/com/smmpanel/app/`
3. Update semua import di file Java

### Ganti Warna Tema
Edit file `res/values/colors.xml`:
```xml
<color name="primary">#6366F1</color>
<color name="primary_dark">#4F46E5</color>
```

## 📱 Screenshots

App ini memiliki tampilan:
- Login page dengan gradient background
- Dashboard dengan 4 stat cards
- Order list dengan status badges
- Service catalog dengan harga
- User management dengan balance

## 🐛 Troubleshooting

### Error: SDK not found
Buat file `local.properties`:
```
sdk.dir=/path/to/Android/sdk
```

### Error: Gradle sync failed
```bash
./gradlew clean
./gradlew --refresh-dependencies
```

### Error: Java version
Pastikan menggunakan JDK 11+:
```bash
java -version
```

## 📄 License

MIT License - Free to use and modify

## 👨‍💻 Developer

Wildan Alfiyandi

---

**Selamat membangun APK! 🎉**
