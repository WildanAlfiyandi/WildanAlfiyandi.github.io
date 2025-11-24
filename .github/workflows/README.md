# 🤖 GitHub Actions - Automated APK Build

## ✅ Setup Complete!

GitHub Actions telah dikonfigurasi untuk **otomatis build APK** setiap kali ada perubahan di folder `android-app/`.

## 🚀 Cara Kerja

### Automatic Build
Workflow akan otomatis berjalan saat:
1. **Push** ke branch `main` atau `copilot/create-android-application`
2. **Pull Request** ke branch `main`
3. Ada perubahan di folder `android-app/`

### Manual Build
Anda juga bisa trigger build manual:
1. Buka tab **Actions** di GitHub
2. Pilih workflow **"Build Android APK"**
3. Klik **"Run workflow"**
4. Pilih branch
5. Klik **"Run workflow"** (hijau)

## 📥 Download APK

### Langkah-langkah:

1. **Buka GitHub Repository**
   ```
   https://github.com/WildanAlfiyandi/WildanAlfiyandi.github.io
   ```

2. **Klik tab "Actions"** (di atas, sebelah Pull requests)

3. **Pilih workflow run terbaru**
   - Akan ada list workflow runs
   - Pilih yang paling atas (terbaru)
   - Pastikan status ✅ (sukses)

4. **Scroll ke bawah ke section "Artifacts"**
   - Akan ada file bernama **"app-debug"**
   - Mungkin juga ada **"app-release-unsigned"**

5. **Download artifact**
   - Klik nama artifact untuk download
   - File akan terdownload sebagai **ZIP**

6. **Extract ZIP**
   - Extract file zip yang didownload
   - Di dalamnya ada file **app-debug.apk**

7. **Install APK**
   - Transfer APK ke Android device
   - Enable "Install from Unknown Sources"
   - Tap APK untuk install

## 📱 APK yang Dihasilkan

### Debug APK
- **Nama**: app-debug.apk
- **Signed**: Yes (debug keystore)
- **Ukuran**: ~3-4 MB
- **Install**: Langsung bisa install
- **Retention**: 30 hari di GitHub

### Release APK (Unsigned)
- **Nama**: app-release-unsigned.apk
- **Signed**: No
- **Perlu**: Sign manual dengan keystore
- **Retention**: 30 hari di GitHub

## 🔄 Build Status

Anda bisa lihat build status dengan badge:

```markdown
![Build Status](https://github.com/WildanAlfiyandi/WildanAlfiyandi.github.io/workflows/Build%20Android%20APK/badge.svg)
```

## ⚙️ Workflow Details

### Build Steps:
1. ✅ Checkout code
2. ✅ Setup JDK 11
3. ✅ Setup Android SDK
4. ✅ Grant gradlew permissions
5. ✅ Build Debug APK
6. ✅ Build Release APK
7. ✅ Upload artifacts

### Build Time:
- First build: ~5-10 menit
- Subsequent builds: ~3-5 menit (dengan cache)

## 🎯 Test Credentials

Setelah install APK:
- **Admin Login**: `admin@example.com` / `admin123`
- **Verification Code**: `123456`
- **Guest Login**: Tap "Continue as Guest"

## 📊 Workflow Configuration

File: `.github/workflows/android-build.yml`

### Triggers:
```yaml
on:
  push:
    branches: [ main, copilot/create-android-application ]
    paths:
      - 'android-app/**'
  pull_request:
    branches: [ main ]
  workflow_dispatch:  # Manual trigger
```

### Environment:
- **OS**: Ubuntu Latest
- **Java**: JDK 11 (Temurin)
- **Android SDK**: Latest via android-actions/setup-android

## 🔧 Troubleshooting

### Build Failed
1. Check workflow logs di tab Actions
2. Lihat error message
3. Fix issue di code
4. Push lagi (auto re-build)

### Artifact Not Found
1. Pastikan workflow selesai (✅ green)
2. Scroll sampai bawah di workflow run page
3. Section "Artifacts" ada di paling bawah

### APK Won't Install
1. Enable "Install from Unknown Sources"
2. Check minimum Android version (5.0+)
3. Uninstall old version first

## 🎨 Features Included in APK

### 6 Screens:
1. ✅ Splash Screen - 3s animation
2. ✅ Login - Email, Google, Facebook, Guest
3. ✅ Register - Email verification
4. ✅ Dashboard - Products & balance
5. ✅ Payment - QRIS, DANA, GoPay, OVO
6. ✅ Admin Panel - Deploy, Spotify, Analytics

### Animations:
- Fade in/out transitions
- Slide left/right navigation
- Smooth page changes

## 📚 Additional Resources

- **Build Guide**: See `android-app/BUILD_GUIDE.md`
- **Architecture**: See `android-app/ARCHITECTURE.md`
- **Screenshots**: See `android-app/SCREENSHOT_GUIDE.md`
- **Features**: See `android-app/FEATURES_SUMMARY.md`

## 🔐 Security Notes

### Debug APK:
- ✅ Signed with debug keystore (auto-generated)
- ✅ Safe to install for testing
- ❌ Not for production/Play Store

### Release APK:
- ⚠️ Unsigned (needs manual signing)
- For Play Store, perlu sign dengan keystore production
- See BUILD_GUIDE.md untuk signing instructions

## 💡 Tips

1. **Bookmark Actions page** untuk akses cepat
2. **Enable notifications** untuk build status
3. **Keep artifacts** selalu ada untuk 30 hari
4. **Manual trigger** jika ingin rebuild tanpa push code

## 🎉 Quick Start

```bash
# 1. Push code changes
git add .
git commit -m "Update Android app"
git push

# 2. Wait 5-10 minutes

# 3. Download APK from:
# https://github.com/WildanAlfiyandi/WildanAlfiyandi.github.io/actions

# 4. Install dan test!
```

## 📞 Support

- **Build Issues**: Check Actions logs
- **APK Issues**: See BUILD_GUIDE.md
- **Feature Requests**: Open issue di GitHub

---

**Created**: 2025-11-24  
**Workflow**: Build Android APK  
**Status**: ✅ Active  
**Retention**: 30 days  
**Auto-build**: Enabled
