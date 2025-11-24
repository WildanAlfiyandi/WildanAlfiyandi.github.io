# Build Guide - Digital Platform Android App

## Prerequisites

### Required Software
1. **JDK 11 atau lebih tinggi**
   ```bash
   java -version
   # Should show version 11 or higher
   ```

2. **Android Studio** (Latest stable version)
   - Download: https://developer.android.com/studio
   - Include Android SDK Platform 34
   - Include Android SDK Build-Tools

3. **Gradle** (Optional - Android Studio includes it)
   - Version 7.5 or higher

## Building the APK

### Method 1: Using Android Studio (Recommended)

#### Step 1: Open Project
1. Launch Android Studio
2. Select "Open an Existing Project"
3. Navigate to `android-app/` directory
4. Click "OK"

#### Step 2: Sync Gradle
1. Wait for "Gradle sync" to complete
2. If prompted, click "Sync Now"
3. Download any missing dependencies

#### Step 3: Build Debug APK
1. Go to: `Build > Build Bundle(s) / APK(s) > Build APK(s)`
2. Wait for build to complete
3. Click "locate" in the notification to find the APK

**APK Location:** `android-app/app/build/outputs/apk/debug/app-debug.apk`

#### Step 4: Build Release APK (Signed)
1. Go to: `Build > Generate Signed Bundle / APK`
2. Select "APK" and click "Next"
3. Create a new keystore or use existing:
   - **Key store path**: Choose location for .jks file
   - **Password**: Create strong password
   - **Key alias**: e.g., "digital-platform"
   - **Validity**: 25 years (recommended)
4. Select "release" build variant
5. Click "Finish"

**Release APK Location:** `android-app/app/build/outputs/apk/release/app-release.apk`

### Method 2: Command Line Build

#### Step 1: Navigate to Project
```bash
cd android-app/
```

#### Step 2: Make gradlew Executable (Unix/Mac)
```bash
chmod +x gradlew
```

#### Step 3: Build Debug APK
```bash
# Unix/Mac/Linux
./gradlew assembleDebug

# Windows
gradlew.bat assembleDebug
```

**Output:** `app/build/outputs/apk/debug/app-debug.apk`

#### Step 4: Build Release APK (Unsigned)
```bash
./gradlew assembleRelease
```

**Note:** Release APK needs to be signed before distribution.

### Method 3: Create Signed Release via Command Line

#### Step 1: Create Keystore
```bash
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

Follow prompts to set password and details.

#### Step 2: Create signing.properties
Create `android-app/signing.properties`:
```properties
KEYSTORE_FILE=../my-release-key.jks
KEYSTORE_PASSWORD=your_keystore_password
KEY_ALIAS=my-key-alias
KEY_PASSWORD=your_key_password
```

**⚠️ Important:** Add `signing.properties` to `.gitignore`!

#### Step 3: Update app/build.gradle
Add before `buildTypes`:
```gradle
def keystorePropertiesFile = rootProject.file("signing.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    // ... existing config ...
    
    signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                storeFile file(keystoreProperties['KEYSTORE_FILE'])
                storePassword keystoreProperties['KEYSTORE_PASSWORD']
                keyAlias keystoreProperties['KEY_ALIAS']
                keyPassword keystoreProperties['KEY_PASSWORD']
            }
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

#### Step 4: Build Signed Release
```bash
./gradlew assembleRelease
```

## Installing the APK

### Install on Physical Device

#### Via USB:
1. Enable Developer Options on Android device:
   - Go to Settings > About Phone
   - Tap "Build Number" 7 times
2. Enable USB Debugging:
   - Settings > Developer Options > USB Debugging
3. Connect device to computer
4. Use ADB:
   ```bash
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```

#### Via File Transfer:
1. Copy APK to device storage
2. On device, use File Manager to find APK
3. Tap APK file
4. Enable "Install from Unknown Sources" if prompted
5. Tap "Install"

### Install on Emulator

#### In Android Studio:
1. Open AVD Manager (Tools > Device Manager)
2. Create or start an emulator
3. Drag and drop APK onto emulator
4. Or use: `adb install app-debug.apk`

## Testing the App

### Features to Test

1. **Splash Screen**
   - Should show for 3 seconds
   - Animations should be smooth
   - Auto-navigate to Login

2. **Login Screen**
   - Email/Password login
   - Google login button (mock)
   - Facebook login button (mock)
   - Guest login
   - Navigate to Register

3. **Register Screen**
   - Fill all fields
   - Send verification code
   - Enter code "123456"
   - Complete registration

4. **Dashboard**
   - Shows welcome message
   - Balance display
   - Product cards
   - Admin panel (if logged in as admin)
   - Navigation buttons

5. **Payment Screen**
   - Enter amount
   - Select payment method
   - Process payment (mock)

6. **Admin Panel** (admin login only)
   - Website deployment UI
   - Spotify player button
   - Analytics button

### Test Credentials

**Admin Login:**
- Email: `admin@example.com`
- Password: `admin123`

**Email Verification Code:**
- Code: `123456`

## Troubleshooting

### Common Issues

#### 1. Gradle Sync Failed
**Solution:**
```bash
# Clear Gradle cache
./gradlew clean
# Or delete .gradle folder
rm -rf .gradle
```

#### 2. SDK Not Found
**Solution:**
- Open Android Studio > Preferences > Appearance & Behavior > System Settings > Android SDK
- Install SDK Platform 34
- Install Build Tools

#### 3. Java Version Error
**Solution:**
```bash
# Check Java version
java -version

# On Mac with brew:
brew install openjdk@11
```

#### 4. APK Not Installing
**Solution:**
- Check minimum Android version (API 21 / Android 5.0)
- Enable "Install from Unknown Sources"
- Check device storage

#### 5. App Crashes on Launch
**Solution:**
- Check logcat in Android Studio
- Ensure all activities are in AndroidManifest.xml
- Verify layout files exist

### Build Errors Reference

#### Error: "R cannot be resolved"
```bash
# Clean and rebuild
./gradlew clean
./gradlew assembleDebug
```

#### Error: "Duplicate class found"
```gradle
// Check dependencies in build.gradle
// Remove duplicate implementations
```

#### Error: "Manifest merger failed"
```gradle
// Add to app/build.gradle
android {
    packagingOptions {
        exclude 'META-INF/DEPENDENCIES'
        exclude 'META-INF/LICENSE'
        exclude 'META-INF/NOTICE'
    }
}
```

## Optimization for Production

### 1. Enable ProGuard/R8
```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

### 2. Reduce APK Size
```gradle
android {
    splits {
        abi {
            enable true
            reset()
            include 'armeabi-v7a', 'arm64-v8a'
            universalApk false
        }
    }
}
```

### 3. Add Version Code and Name
```gradle
defaultConfig {
    versionCode 1
    versionName "1.0.0"
}
```

## Distribution

### Google Play Store

1. **Prepare:**
   - Signed release APK
   - App icon (512x512)
   - Screenshots (various sizes)
   - Feature graphic (1024x500)
   - Privacy policy URL

2. **Create Developer Account:**
   - https://play.google.com/console
   - $25 one-time fee

3. **Upload APK:**
   - Create new app
   - Fill app details
   - Upload release APK
   - Submit for review

### Alternative Distribution

1. **Direct Download:**
   - Host APK on website
   - Users download and install manually

2. **APK Mirror Sites:**
   - APKPure
   - APKMirror (requires verification)

3. **Firebase App Distribution:**
   - Beta testing
   - Internal distribution

## CI/CD Setup (Optional)

### GitHub Actions Example

Create `.github/workflows/android.yml`:
```yaml
name: Android CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 11
      uses: actions/setup-java@v3
      with:
        java-version: '11'
        distribution: 'temurin'
    
    - name: Grant execute permission for gradlew
      run: chmod +x gradlew
      working-directory: android-app
    
    - name: Build with Gradle
      run: ./gradlew build
      working-directory: android-app
    
    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: app-debug
        path: android-app/app/build/outputs/apk/debug/app-debug.apk
```

## Resources

- **Android Developers**: https://developer.android.com
- **Gradle Documentation**: https://gradle.org/guides/
- **ProGuard**: https://www.guardsquare.com/proguard
- **App Signing**: https://developer.android.com/studio/publish/app-signing

## Support

For build issues:
1. Check error logs in Android Studio
2. Search Stack Overflow
3. Check official Android documentation
4. Review this guide's troubleshooting section

---

**Current App Version**: 1.0.0  
**Min Android Version**: 5.0 (API 21)  
**Target Android Version**: 14 (API 34)  
**Build System**: Gradle 7.5
