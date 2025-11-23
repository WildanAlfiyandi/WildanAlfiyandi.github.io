# 📱 Android App - Visual Guide & Build Instructions

## 🖼️ Screenshots & UI Preview

Aplikasi ini memiliki 6 screen utama dengan UI modern dan animasi smooth. Berikut preview tampilan setiap screen:

### 1. Splash Screen (Layar Pembuka)
**Durasi**: 3 detik  
**Animasi**: Fade in logo + slide up text

```
┌─────────────────────────┐
│                         │
│                         │
│         🚀              │
│    (Logo Icon)          │
│                         │
│   Digital Platform      │
│                         │
│ Your Digital Products   │
│         Hub             │
│                         │
│                         │
│    Version 1.0.0        │
└─────────────────────────┘
```

**Elemen UI:**
- Icon besar di tengah (120dp x 120dp)
- Judul "Digital Platform" (28sp, bold)
- Tagline "Your Digital Products Hub" (14sp)
- Version info di bawah
- Background putih dengan animasi fade in

**Transisi:** Otomatis ke Login Screen setelah 3 detik

---

### 2. Login Screen (Halaman Login)
**Fitur**: Email, Google, Facebook, Guest login

```
┌─────────────────────────┐
│      🚀 (Icon)          │
│                         │
│   Welcome Back!         │
│  Login to your account  │
│                         │
│ ┌─────────────────────┐ │
│ │ Email               │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Password            │ │
│ └─────────────────────┘ │
│    Forgot Password? --> │
│                         │
│ ┌─────────────────────┐ │
│ │      Login          │ │
│ └─────────────────────┘ │
│                         │
│  Or continue with       │
│                         │
│ ┌─────────────────────┐ │
│ │ Continue with Google│ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │Continue with Facebook│ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ Continue as Guest   │ │
│ └─────────────────────┘ │
│                         │
│ Don't have account?     │
│      Register           │
└─────────────────────────┘
```

**Elemen UI:**
- Input field untuk email (white background, elevated)
- Input field untuk password (white background, elevated)
- Link "Forgot Password" (green color)
- Button "Login" (green, bold)
- Button "Google" (white background)
- Button "Facebook" (blue #1877F2)
- Button "Guest" (gray)
- Link "Register" (green, bold)

**Test Credentials:**
- Email: `admin@example.com`
- Password: `admin123`

**Transisi:** Slide right ke Dashboard/Register

---

### 3. Register Screen (Halaman Registrasi)
**Fitur**: Email registration dengan verification code

```
┌─────────────────────────┐
│   Create Account        │
│ Register to get started │
│                         │
│ ┌─────────────────────┐ │
│ │ Full Name           │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Email               │ │
│ └─────────────────────┘ │
│    [Send Verification   │
│         Code] -->       │
│                         │
│ ┌─────────────────────┐ │
│ │ Verification Code   │ │
│ └─────────────────────┘ │
│ Check your email for    │
│ the code                │
│                         │
│ ┌─────────────────────┐ │
│ │ Password            │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Confirm Password    │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │     Register        │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

**Elemen UI:**
- Input fields untuk name, email, password
- Button "Send Verification Code" (blue)
- Input field untuk kode verifikasi (muncul setelah send code)
- Button "Register" (green, bold)

**Flow:**
1. Isi nama dan email
2. Tap "Send Verification Code"
3. Masukkan kode: `123456`
4. Isi password dan confirm
5. Tap "Register"

**Transisi:** Kembali ke Login Screen

---

### 4. Dashboard (Layar Utama)
**Fitur**: Products, Balance, Admin Access

```
┌─────────────────────────┐
│ ╔═══════════════════╗   │
│ ║ Selamat Datang!   ║   │
│ ║                   ║   │
│ ║  Rp 1.500.000     ║   │
│ ║   Saldo Anda      ║   │
│ ╚═══════════════════╝   │
│                         │
│ [Top Up] [Akun]         │
│                         │
│ [🔐 Admin Panel]        │
│  (only for admin)       │
│                         │
│ Produk Digital          │
│                         │
│ ┌─────────────────────┐ │
│ │ Premium Template    │ │
│ │    Website          │ │
│ │  Rp 150.000         │ │
│ │         [Beli] -->  │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Digital Marketing   │ │
│ │      Tools          │ │
│ │  Rp 250.000         │ │
│ │         [Beli] -->  │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

**Elemen UI:**
- Header hijau dengan welcome message dan saldo
- Quick action buttons (Top Up, Akun)
- Admin Panel button (hanya muncul jika login sebagai admin)
- Product cards dengan harga dan tombol beli
- Elevated cards dengan shadow

**Akses Admin:**
- Login dengan `admin@example.com` untuk lihat Admin Panel button

**Transisi:** Tap buttons untuk navigasi

---

### 5. Payment Screen (Halaman Pembayaran)
**Fitur**: QRIS, DANA, GoPay, OVO

```
┌─────────────────────────┐
│ Pilih Metode Pembayaran │
│                         │
│ ┌─────────────────────┐ │
│ │ Jumlah (Rp)         │ │
│ └─────────────────────┘ │
│                         │
│ ○ QRIS                  │
│                         │
│ ○ DANA                  │
│                         │
│ ○ GoPay                 │
│                         │
│ ○ OVO                   │
│                         │
│ Pilih metode pembayaran │
│                         │
│ ┌─────────────────────┐ │
│ │  Bayar Sekarang     │ │
│ └─────────────────────┘ │
│                         │
│ Note: Ini mockup UI.    │
│ Integrasi payment       │
│ gateway memerlukan      │
│ merchant account.       │
└─────────────────────────┘
```

**Elemen UI:**
- Input field untuk jumlah
- Radio buttons untuk metode payment
- Info text sesuai metode yang dipilih
- Button "Bayar Sekarang" (green)
- Note tentang mock implementation

**Flow:**
1. Masukkan jumlah (misal: 100000)
2. Pilih metode (QRIS/DANA/GoPay/OVO)
3. Tap "Bayar Sekarang"
4. Mock payment akan "berhasil" setelah 2 detik

**Transisi:** Kembali ke Dashboard setelah success

---

### 6. Admin Panel (Panel Admin)
**Fitur**: Deploy Website, Spotify, Analytics
**Akses**: Admin only

```
┌─────────────────────────┐
│  🔐 Admin Panel         │
│  Advanced Features      │
│                         │
│ Deploy Website          │
│                         │
│ ┌─────────────────────┐ │
│ │ Website URL         │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ File paths atau     │ │
│ │ repository URL      │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ 🚀 Deploy Website   │ │
│ └─────────────────────┘ │
│                         │
│ Music Player            │
│                         │
│ ┌─────────────────────┐ │
│ │ 🎵 Open Spotify     │ │
│ │      Player         │ │
│ └─────────────────────┘ │
│                         │
│ Analytics               │
│                         │
│ ┌─────────────────────┐ │
│ │ 📊 View Analytics   │ │
│ └─────────────────────┘ │
│                         │
│ Note: Admin features    │
│ are mockups. Real       │
│ implementation requires │
│ backend infrastructure. │
└─────────────────────────┘
```

**Elemen UI:**
- Input fields untuk website URL dan files
- Button "Deploy Website" (green)
- Button "Spotify Player" (Spotify green #1DB954)
- Button "Analytics" (blue)
- Note tentang mock implementation

**Flow:**
1. Masukkan website URL
2. Tap "Deploy Website" -> Mock deployment
3. Tap "Spotify Player" -> Info message
4. Tap "Analytics" -> Info message

---

## 🎨 Design Highlights

### Color Palette
- **Primary Green**: #4CAF50
- **Blue**: #2196F3
- **Pink (Admin)**: #E91E63
- **Facebook Blue**: #1877F2
- **Spotify Green**: #1DB954
- **Background**: #F5F5F5
- **Text**: #212121
- **Secondary Text**: #757575

### Animations
1. **Fade In** (1.5s) - Splash screen logo
2. **Slide Up** (1.0s) - Splash screen text
3. **Slide In Right** (0.3s) - Forward navigation
4. **Slide Out Left** (0.3s) - Backward navigation

### Typography
- **Headers**: 24sp, Bold
- **Titles**: 20sp, Bold
- **Body**: 16sp, Regular
- **Small**: 14sp, Regular
- **Tiny**: 12sp, Regular

---

## 📱 Step-by-Step Build Instructions

### Persiapan

#### 1. Install Prerequisites

**A. Install Java Development Kit (JDK)**

**Windows:**
1. Download JDK 11 dari: https://adoptium.net/
2. Pilih "OpenJDK 11 (LTS)"
3. Download dan install
4. Verify installation:
   ```cmd
   java -version
   ```
   Harus menampilkan Java 11 atau lebih tinggi

**Mac:**
```bash
brew install openjdk@11
```

**Linux:**
```bash
sudo apt update
sudo apt install openjdk-11-jdk
```

**B. Install Android Studio**

1. Download dari: https://developer.android.com/studio
2. Install Android Studio
3. Saat pertama kali buka, akan ada setup wizard
4. Pilih "Standard" installation
5. Tunggu sampai download Android SDK selesai

**C. Install Android SDK Components**

1. Buka Android Studio
2. Go to: `Tools > SDK Manager`
3. Di tab "SDK Platforms", centang:
   - Android 13.0 (Tiramisu) - API Level 33
   - Android 14.0 (UpsideDownCake) - API Level 34
4. Di tab "SDK Tools", centang:
   - Android SDK Build-Tools 34
   - Android SDK Command-line Tools
   - Android Emulator (optional, untuk testing)
5. Klik "Apply" dan tunggu download selesai

---

### Method 1: Build dengan Android Studio (RECOMMENDED)

#### Step 1: Clone Repository

```bash
# Clone repository
git clone https://github.com/WildanAlfiyandi/WildanAlfiyandi.github.io.git

# Masuk ke direktori
cd WildanAlfiyandi.github.io/android-app
```

#### Step 2: Open Project di Android Studio

1. **Launch Android Studio**
2. Klik **"Open"** atau **"Open an Existing Project"**
3. Navigate ke folder `android-app` di dalam repository
4. Klik **"OK"**

#### Step 3: Gradle Sync

1. Android Studio akan otomatis mulai "Gradle Sync"
2. Anda akan melihat progress di bagian bawah
3. Jika ada prompt "Gradle Sync needed", klik **"Sync Now"**
4. Tunggu sampai selesai (bisa 5-10 menit pertama kali)

**Troubleshooting Gradle Sync:**
- Jika error "SDK not found": 
  - Go to `File > Project Structure > SDK Location`
  - Set Android SDK location (biasanya: `C:\Users\<username>\AppData\Local\Android\Sdk` di Windows)
- Jika error koneksi internet: Pastikan firewall tidak block Android Studio

#### Step 4: Build Debug APK

1. Di menu, pilih: **`Build > Build Bundle(s) / APK(s) > Build APK(s)`**
2. Tunggu proses build (5-15 menit tergantung PC)
3. Anda akan melihat progress di bagian bawah
4. Setelah selesai, akan muncul notifikasi: **"APK(s) generated successfully"**
5. Klik **"locate"** di notifikasi untuk membuka folder APK

**APK Location:**
```
android-app/app/build/outputs/apk/debug/app-debug.apk
```

#### Step 5: Build Release APK (Signed)

**A. Create Keystore (Sekali Saja)**

1. Di menu: **`Build > Generate Signed Bundle / APK`**
2. Pilih **"APK"** dan klik **"Next"**
3. Klik **"Create new..."** untuk keystore baru
4. Isi form:
   - **Key store path**: Pilih lokasi simpan (misal: `my-release-key.jks`)
   - **Password**: Buat password kuat (INGAT PASSWORD INI!)
   - **Confirm**: Ulangi password
   - **Alias**: `my-key-alias` (atau nama lain)
   - **Validity**: 25 years (default, biarkan)
   - **Certificate**:
     - First and Last Name: Nama Anda
     - Organizational Unit: (opsional)
     - Organization: (opsional)
     - City: Kota Anda
     - State: Provinsi
     - Country Code: ID
5. Klik **"OK"**

**B. Sign and Build**

1. Setelah keystore dibuat, form akan terisi otomatis
2. **PENTING**: Centang "Remember passwords" (opsional tapi praktis)
3. Klik **"Next"**
4. Pilih **"release"** build variant
5. Pilih signature versions (V1 dan V2 - keduanya)
6. Klik **"Finish"**
7. Tunggu build selesai

**Release APK Location:**
```
android-app/app/build/outputs/apk/release/app-release.apk
```

**⚠️ PENTING:**
- **SIMPAN file keystore** (`my-release-key.jks`) di tempat aman
- **INGAT password** keystore dan alias
- **JANGAN commit** keystore ke Git
- Tanpa keystore yang sama, Anda tidak bisa update app di Play Store

---

### Method 2: Build dengan Command Line

#### Step 1: Setup Environment

**Windows:**
```cmd
# Set JAVA_HOME
set JAVA_HOME=C:\Program Files\Java\jdk-11

# Set ANDROID_HOME
set ANDROID_HOME=C:\Users\<username>\AppData\Local\Android\Sdk

# Add to PATH
set PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools
```

**Mac/Linux:**
```bash
# Edit ~/.bashrc atau ~/.zshrc
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-11.jdk/Contents/Home
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools
```

#### Step 2: Navigate to Project

```bash
cd android-app
```

#### Step 3: Make gradlew Executable (Mac/Linux only)

```bash
chmod +x gradlew
```

#### Step 4: Build Debug APK

**Windows:**
```cmd
gradlew.bat assembleDebug
```

**Mac/Linux:**
```bash
./gradlew assembleDebug
```

**Output:**
```
BUILD SUCCESSFUL in 2m 15s
45 actionable tasks: 45 executed

APK: app/build/outputs/apk/debug/app-debug.apk
```

#### Step 5: Build Release APK (Unsigned)

```bash
./gradlew assembleRelease
```

**Note:** Release APK perlu di-sign sebelum bisa diinstall. Lihat section signing di bawah.

---

### Signing Release APK via Command Line

#### Step 1: Create Keystore

```bash
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

Ikuti prompt:
- Enter keystore password: [buat password]
- Re-enter: [ulangi password]
- What is your first and last name? [nama Anda]
- What is the name of your organizational unit? [skip]
- What is the name of your organization? [skip]
- What is the name of your City? [kota]
- What is the name of your State? [provinsi]
- What is the two-letter country code? ID
- Is CN=... correct? yes
- Enter key password: [buat password]

#### Step 2: Sign APK Manually

```bash
# Build unsigned release APK
./gradlew assembleRelease

# Sign dengan jarsigner
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore my-release-key.jks app/build/outputs/apk/release/app-release-unsigned.apk my-key-alias

# Verify signature
jarsigner -verify -verbose -certs app/build/outputs/apk/release/app-release-unsigned.apk

# Zipalign (optimize)
$ANDROID_HOME/build-tools/34.0.0/zipalign -v 4 app/build/outputs/apk/release/app-release-unsigned.apk app/build/outputs/apk/release/app-release-signed.apk
```

---

## 📥 Install APK ke Android Device

### Method 1: Install via USB (ADB)

#### Step 1: Enable Developer Options

1. Buka **Settings** di Android
2. Scroll ke **About Phone**
3. Tap **Build Number** 7 kali
4. Akan muncul "You are now a developer!"

#### Step 2: Enable USB Debugging

1. Kembali ke **Settings**
2. Cari **Developer Options**
3. Enable **USB Debugging**

#### Step 3: Connect & Install

```bash
# Connect device via USB
# Accept "Allow USB debugging" di device

# Verify device connected
adb devices

# Install APK
adb install app/build/outputs/apk/debug/app-debug.apk

# Or for release
adb install app/build/outputs/apk/release/app-release.apk
```

**Troubleshooting:**
- Device not found: Install USB drivers untuk device Anda
- Unauthorized: Accept prompt di device
- Install failed: Uninstall old version first: `adb uninstall com.wildanalfiyandi.deploymentplatform`

### Method 2: Install via File Transfer

#### Step 1: Copy APK to Phone

**Via USB Cable:**
1. Connect phone ke PC
2. Pilih "File Transfer" mode di phone
3. Copy `app-debug.apk` ke folder Download di phone

**Via Cloud:**
1. Upload APK ke Google Drive / Dropbox
2. Download di phone

#### Step 2: Install

1. Buka **File Manager** di phone
2. Navigate ke folder Downloads
3. Tap file APK
4. Jika muncul "Install blocked", tap **Settings**
5. Enable **"Install from this source"** atau **"Allow from this source"**
6. Kembali dan tap APK lagi
7. Tap **"Install"**
8. Tunggu instalasi selesai
9. Tap **"Open"**

---

## 🧪 Testing the App

### Test Scenario 1: Splash Screen

1. **Launch app**
2. **Observe**: Logo fade in, text slide up
3. **Wait**: 3 seconds
4. **Expected**: Auto navigate to Login

### Test Scenario 2: Login Flow

**A. Email Login (Admin)**
1. Email: `admin@example.com`
2. Password: `admin123`
3. Tap **Login**
4. **Expected**: Navigate to Dashboard with Admin Panel button visible

**B. Email Login (Regular User)**
1. Email: any other email
2. Password: any password
3. Tap **Login**
4. **Expected**: Navigate to Dashboard without Admin Panel button

**C. Google Login**
1. Tap **Continue with Google**
2. **Expected**: Toast message + navigate to Dashboard after 1s

**D. Facebook Login**
1. Tap **Continue with Facebook**
2. **Expected**: Toast message + navigate to Dashboard after 1s

**E. Guest Login**
1. Tap **Continue as Guest**
2. **Expected**: Navigate to Dashboard immediately

### Test Scenario 3: Registration

1. Tap **Register** from Login screen
2. Fill: Name, Email
3. Tap **Send Verification Code**
4. **Expected**: Toast showing code sent, verification field appears
5. Enter code: `123456`
6. Fill: Password, Confirm Password
7. Tap **Register**
8. **Expected**: Success message, return to Login

### Test Scenario 4: Payment

1. From Dashboard, tap **Top Up**
2. Enter amount: `100000`
3. Select payment method (QRIS/DANA/GoPay/OVO)
4. Tap **Bayar Sekarang**
5. **Expected**: Processing message, success after 2s

### Test Scenario 5: Admin Panel

1. Login as admin
2. Tap **Admin Panel** button
3. Enter website URL
4. Tap **Deploy Website**
5. **Expected**: Mock deployment success
6. Tap **Spotify Player**
7. **Expected**: Info message
8. Tap **Analytics**
9. **Expected**: Info message

---

## 🐛 Common Issues & Solutions

### Build Issues

**1. Gradle sync failed**
```bash
# Clear gradle cache
./gradlew clean

# Or delete .gradle folder
rm -rf .gradle
```

**2. SDK not found**
- Open Android Studio > Preferences > Android SDK
- Install SDK Platform 34
- Install Build Tools

**3. Java version error**
```bash
# Check version
java -version

# Should be 11 or higher
```

**4. Out of memory**
Add to `gradle.properties`:
```properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=1024m
```

### Installation Issues

**1. App not installed**
- Check minimum Android version (5.0 / API 21)
- Uninstall old version first
- Enable "Install from Unknown Sources"

**2. Parse error**
- APK corrupted, rebuild
- Incompatible architecture

**3. Installation blocked**
- Go to Settings > Security
- Enable "Unknown sources" or "Install unknown apps"

---

## 📊 APK Size & Performance

**Expected APK Size:**
- Debug: ~3-4 MB
- Release (unoptimized): ~2-3 MB
- Release (optimized with ProGuard): ~1-2 MB

**Startup Time:**
- Splash screen: 3 seconds (by design)
- Total cold start: ~4-5 seconds

**Minimum Requirements:**
- Android 5.0 (API 21) or higher
- ~50 MB storage
- ~50 MB RAM

---

## 🚀 Next Steps

### For Development
1. ✅ Build successful
2. ✅ Install on device
3. ✅ Test all screens
4. 🔜 Setup backend (see ARCHITECTURE.md)
5. 🔜 Replace mocks with real APIs
6. 🔜 Beta testing
7. 🔜 Publish to Play Store

### For Testing
- Test on different Android versions
- Test on different screen sizes
- Test with slow internet
- Test edge cases

### For Production
- Setup CI/CD (GitHub Actions)
- Configure ProGuard
- Optimize images
- Add crash reporting (Firebase Crashlytics)
- Add analytics (Firebase Analytics)

---

## 📞 Support

**Build Issues:**
- Check BUILD_GUIDE.md
- Check Android Studio logcat
- Search Stack Overflow
- Check official Android documentation

**Backend Integration:**
- See ARCHITECTURE.md
- Review API specifications
- Check integration examples

**General Questions:**
- Review README.md
- Check FEATURES_SUMMARY.md

---

**Created**: 2025-11-23  
**Version**: 1.0.0  
**Status**: Production-ready UI prototype  
**Total Screens**: 6  
**Build Time**: ~5-15 minutes (first build)  
**APK Size**: ~2-4 MB
