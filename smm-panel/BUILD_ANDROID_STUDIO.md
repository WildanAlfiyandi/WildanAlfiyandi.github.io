# SMM Panel - Android Studio Build Guide

## 📱 Build APK dengan Android Studio

Panduan lengkap untuk mengubah PWA SMM Panel menjadi aplikasi Android native menggunakan Android Studio.

---

## 🛠️ Prerequisites

### Software yang Diperlukan:
1. **Android Studio** (versi terbaru)
   - Download: https://developer.android.com/studio
2. **Node.js** v16 atau lebih baru
   - Download: https://nodejs.org/
3. **Java JDK** 11 atau 17
   - Download: https://adoptium.net/

---

## 📋 Metode 1: TWA (Trusted Web Activity) - Direkomendasikan

TWA adalah cara terbaik untuk mengubah PWA menjadi Android app karena menggunakan Chrome untuk rendering, memberikan performa optimal.

### Langkah 1: Setup Project

```bash
# Buat folder project baru
mkdir smm-panel-android
cd smm-panel-android

# Inisialisasi npm project
npm init -y

# Install Bubblewrap
npm install @anthropic/anthropic-cli
npx @anthropic/bubblewrap
```

### Langkah 2: Konfigurasi Bubblewrap

```bash
# Jalankan init dengan manifest URL
npx bubblewrap init --manifest https://YOUR_DOMAIN/smm-panel/manifest.json
```

Jawab pertanyaan konfigurasi:
- **Application ID**: `com.yourcompany.smmpanel`
- **Application name**: `SMM Panel`
- **Short name**: `SMM Panel`
- **Start URL**: `/smm-panel/`
- **Display mode**: `standalone`
- **Signing key**: Buat baru atau gunakan yang ada

### Langkah 3: Build APK

```bash
# Build debug APK
npx bubblewrap build

# Output: app-debug.apk dan app-release-signed.apk
```

### Langkah 4: Buka di Android Studio

```bash
# Buka project
npx bubblewrap androidProject
```

Kemudian buka folder `android` di Android Studio.

---

## 📋 Metode 2: WebView dengan Android Studio

### Langkah 1: Buat Project Baru

1. Buka Android Studio
2. Klik **"New Project"**
3. Pilih **"Empty Activity"**
4. Konfigurasi:
   - Name: `SMM Panel`
   - Package name: `com.yourcompany.smmpanel`
   - Language: `Kotlin` atau `Java`
   - Minimum SDK: `API 21 (Android 5.0)`

### Langkah 2: Copy Web Files

Copy seluruh isi folder `smm-panel` ke:
```
app/src/main/assets/smm-panel/
```

Struktur folder:
```
app/src/main/assets/
└── smm-panel/
    ├── index.html
    ├── manifest.json
    ├── sw.js
    ├── css/
    ├── js/
    └── icons/
```

### Langkah 3: Konfigurasi Layout

Edit `app/src/main/res/layout/activity_main.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <WebView
        android:id="@+id/webView"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

    <!-- Splash Screen -->
    <LinearLayout
        android:id="@+id/splashView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:background="@color/splash_bg"
        android:gravity="center"
        android:orientation="vertical">

        <ImageView
            android:layout_width="120dp"
            android:layout_height="120dp"
            android:src="@drawable/ic_logo" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="16dp"
            android:text="SMM Panel"
            android:textColor="@android:color/white"
            android:textSize="24sp"
            android:textStyle="bold" />

        <ProgressBar
            android:layout_width="48dp"
            android:layout_height="48dp"
            android:layout_marginTop="24dp"
            android:indeterminateTint="@color/primary" />
    </LinearLayout>

</RelativeLayout>
```

### Langkah 4: Setup MainActivity

Edit `MainActivity.kt` (Kotlin):

```kotlin
package com.yourcompany.smmpanel

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.View
import android.webkit.*
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private var fileUploadCallback: ValueCallback<Array<Uri>>? = null

    companion object {
        private const val FILE_CHOOSER_REQUEST = 1001
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        val splashView = findViewById<View>(R.id.splashView)

        // WebView Settings
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            databaseEnabled = true
            cacheMode = WebSettings.LOAD_DEFAULT
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
            useWideViewPort = true
            loadWithOverviewMode = true
            setSupportZoom(false)
            builtInZoomControls = false
            displayZoomControls = false
        }

        // Enable IndexedDB
        webView.settings.databaseEnabled = true
        webView.settings.domStorageEnabled = true

        // WebView Client
        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                // Hide splash after page loads
                Handler(Looper.getMainLooper()).postDelayed({
                    splashView.visibility = View.GONE
                    webView.visibility = View.VISIBLE
                }, 500)
            }

            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url.toString()
                return if (url.startsWith("http://") || url.startsWith("https://")) {
                    if (url.contains("YOUR_DOMAIN")) {
                        false // Load in WebView
                    } else {
                        // Open external links in browser
                        startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                        true
                    }
                } else {
                    false
                }
            }
        }

        // WebChrome Client for file uploads
        webView.webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                fileUploadCallback?.onReceiveValue(null)
                fileUploadCallback = filePathCallback

                val intent = Intent(Intent.ACTION_GET_CONTENT)
                intent.addCategory(Intent.CATEGORY_OPENABLE)
                intent.type = "*/*"
                startActivityForResult(
                    Intent.createChooser(intent, "Pilih File"),
                    FILE_CHOOSER_REQUEST
                )
                return true
            }

            override fun onConsoleMessage(consoleMessage: ConsoleMessage?): Boolean {
                // Log JavaScript console messages
                return super.onConsoleMessage(consoleMessage)
            }
        }

        // Load the app
        webView.loadUrl("file:///android_asset/smm-panel/index.html")
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == FILE_CHOOSER_REQUEST) {
            if (resultCode == Activity.RESULT_OK && data != null) {
                val result = data.data
                if (result != null) {
                    fileUploadCallback?.onReceiveValue(arrayOf(result))
                } else {
                    fileUploadCallback?.onReceiveValue(null)
                }
            } else {
                fileUploadCallback?.onReceiveValue(null)
            }
            fileUploadCallback = null
        }
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
```

### Langkah 5: Konfigurasi AndroidManifest.xml

Edit `app/src/main/AndroidManifest.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.yourcompany.smmpanel">

    <!-- Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.CAMERA" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.SMMPanel"
        android:usesCleartextTraffic="true"
        android:hardwareAccelerated="true">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="portrait"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

    </application>

</manifest>
```

### Langkah 6: Setup Colors & Theme

Edit `app/src/main/res/values/colors.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="primary">#6366F1</color>
    <color name="primary_dark">#4F46E5</color>
    <color name="accent">#A855F7</color>
    <color name="splash_bg">#0F0F23</color>
    <color name="white">#FFFFFF</color>
    <color name="black">#000000</color>
</resources>
```

Edit `app/src/main/res/values/themes.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.SMMPanel" parent="Theme.AppCompat.NoActionBar">
        <item name="colorPrimary">@color/primary</item>
        <item name="colorPrimaryDark">@color/primary_dark</item>
        <item name="colorAccent">@color/accent</item>
        <item name="android:statusBarColor">@color/splash_bg</item>
        <item name="android:navigationBarColor">@color/splash_bg</item>
        <item name="android:windowBackground">@color/splash_bg</item>
    </style>
</resources>
```

### Langkah 7: Setup App Icons

1. Klik kanan pada `res` folder
2. Pilih **New > Image Asset**
3. Pilih icon source (upload logo SMM Panel)
4. Generate untuk semua ukuran

### Langkah 8: Build APK

1. Klik **Build > Build Bundle(s) / APK(s) > Build APK(s)**
2. APK akan tersimpan di:
   ```
   app/build/outputs/apk/debug/app-debug.apk
   ```

### Langkah 9: Build Release APK

1. Klik **Build > Generate Signed Bundle / APK**
2. Pilih **APK**
3. Buat keystore baru atau pilih yang ada:
   - Key store path: `smmpanel.jks`
   - Password: (buat password)
   - Key alias: `smmpanel`
   - Key password: (buat password)
4. Build type: **release**
5. Klik **Create**

---

## 📋 Metode 3: Capacitor (Ionic)

### Langkah 1: Setup Capacitor

```bash
# Di folder smm-panel
npm init -y
npm install @capacitor/core @capacitor/cli
npx cap init "SMM Panel" "com.yourcompany.smmpanel"
```

### Langkah 2: Konfigurasi

Edit `capacitor.config.json`:

```json
{
  "appId": "com.yourcompany.smmpanel",
  "appName": "SMM Panel",
  "webDir": ".",
  "bundledWebRuntime": false,
  "server": {
    "androidScheme": "https"
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000,
      "backgroundColor": "#0F0F23"
    }
  }
}
```

### Langkah 3: Add Android Platform

```bash
npm install @capacitor/android
npx cap add android
npx cap sync
```

### Langkah 4: Open in Android Studio

```bash
npx cap open android
```

---

## 🔧 Troubleshooting

### Masalah Umum

#### 1. Manifest Merger Error (Jetpack Compose) ⚠️ PALING UMUM

Jika muncul error seperti:
```
Merging decision tree log
MERGED from [androidx.compose.material3:material3-android:1.3.0]...
```

**Ini terjadi karena Gradle Cache masih menyimpan Compose dependencies dari project lain.**

---

### ✅ SOLUSI LENGKAP (Ikuti Semua Langkah):

#### Langkah 1: Hapus Gradle Cache Global

Buka **File Explorer** dan hapus folder berikut:
```
C:\Users\[NamaUser]\.gradle\caches\
```

Atau jalankan di **Command Prompt / PowerShell**:
```cmd
rd /s /q "%USERPROFILE%\.gradle\caches"
```

**Untuk Mac/Linux:**
```bash
rm -rf ~/.gradle/caches/
```

---

#### Langkah 2: Buat Project Baru dengan Benar

1. Buka Android Studio
2. Klik **File > New > New Project**
3. **⚠️ PENTING: Pilih "Empty Views Activity"** (BUKAN "Empty Activity")
   - "Empty Activity" = dengan Compose
   - "Empty Views Activity" = tanpa Compose (yang kita butuhkan)
4. Konfigurasi:
   - Name: `SMM Panel`
   - Package name: `com.yourcompany.smmpanel`
   - Language: **Java** (lebih simple) atau Kotlin
   - Minimum SDK: API 21
5. **Jangan centang** "Use Compose"

---

#### Langkah 3: Verifikasi build.gradle (Module: app)

Pastikan file `app/build.gradle` atau `app/build.gradle.kts` **TIDAK** memiliki:

```gradle
// ❌ HAPUS SEMUA INI jika ada:
buildFeatures {
    compose = true
}
composeOptions {
    kotlinCompilerExtensionVersion = "..."
}

dependencies {
    // ❌ HAPUS dependency compose:
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.material3)
}
```

**Ganti dengan dependencies ini:**

```gradle
dependencies {
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    implementation("com.google.android.material:material:1.11.0")
    implementation("androidx.webkit:webkit:1.8.0")
}
```

---

#### Langkah 4: Verifikasi libs.versions.toml (jika ada)

Jika ada file `gradle/libs.versions.toml`, hapus semua entry compose:

```toml
# ❌ HAPUS semua baris yang mengandung "compose":
# androidx-activity-compose = ...
# androidx-compose-bom = ...
# ui = ...
# material3 = ...
```

---

#### Langkah 5: Hapus Cache Project & Rebuild

1. Tutup Android Studio
2. Hapus folder `.gradle` di dalam project:
   ```cmd
   rd /s /q "C:\Users\[NamaUser]\AndroidStudioProjects\[NamaProject]\.gradle"
   ```
3. Hapus folder `build`:
   ```cmd
   rd /s /q "C:\Users\[NamaUser]\AndroidStudioProjects\[NamaProject]\app\build"
   ```
4. Buka lagi Android Studio
5. Klik **File > Sync Project with Gradle Files**
6. Klik **Build > Clean Project**
7. Klik **Build > Rebuild Project**

---

#### Langkah 6: Invalidate Caches (Jika Masih Error)

1. Klik **File > Invalidate Caches...**
2. Centang semua opsi
3. Klik **Invalidate and Restart**
4. Tunggu Android Studio restart dan re-index

---

### 📋 build.gradle (Module: app) yang BENAR

Contoh lengkap file `app/build.gradle` yang benar untuk WebView app:

```gradle
plugins {
    id 'com.android.application'
}

android {
    namespace 'com.yourcompany.smmpanel'
    compileSdk 34

    defaultConfig {
        applicationId "com.yourcompany.smmpanel"
        minSdk 21
        targetSdk 34
        versionCode 1
        versionName "1.0"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.webkit:webkit:1.8.0'
}
```

---

### 📋 MainActivity.java yang SIMPLE

Gunakan Java untuk lebih simple. Buat file `MainActivity.java`:

```java
package com.yourcompany.smmpanel;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    
    private WebView webView;
    private ValueCallback<Uri[]> fileUploadCallback;
    private static final int FILE_CHOOSER_REQUEST = 1001;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        webView = findViewById(R.id.webView);
        
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        
        webView.setWebViewClient(new WebViewClient());
        
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView webView, 
                    ValueCallback<Uri[]> filePathCallback,
                    FileChooserParams fileChooserParams) {
                fileUploadCallback = filePathCallback;
                Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("*/*");
                startActivityForResult(intent, FILE_CHOOSER_REQUEST);
                return true;
            }
        });
        
        // Load from assets
        webView.loadUrl("file:///android_asset/smm-panel/index.html");
    }
    
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == FILE_CHOOSER_REQUEST && fileUploadCallback != null) {
            Uri[] result = null;
            if (resultCode == Activity.RESULT_OK && data != null) {
                result = new Uri[]{data.getData()};
            }
            fileUploadCallback.onReceiveValue(result);
            fileUploadCallback = null;
        }
    }
    
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
```

---

### 📋 activity_main.xml yang SIMPLE

```xml
<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <WebView
        android:id="@+id/webView"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</FrameLayout>
```

---

#### 2. WebView tidak memuat
- Pastikan `android:usesCleartextTraffic="true"` di manifest
- Cek permission INTERNET

#### 3. IndexedDB tidak bekerja
- Pastikan `domStorageEnabled = true`
- Pastikan `databaseEnabled = true`

#### 4. File upload tidak berfungsi
- Implement `onShowFileChooser` di WebChromeClient
- Tambahkan permission storage

#### 5. CSS/JS tidak dimuat
- Pastikan path asset benar
- Cek console log untuk error

#### 6. Gradle Sync Failed
- Pastikan Android SDK terbaru terinstall
- Cek koneksi internet untuk download dependencies
- File > Invalidate Caches and Restart

---

## 📦 Distribusi

### Google Play Store

1. Build signed APK/AAB
2. Buat akun Google Play Developer ($25)
3. Buat app listing
4. Upload AAB file
5. Submit for review

### Direct Distribution

1. Build signed APK
2. Host APK di website
3. User enable "Unknown Sources"
4. Download & install

---

## 📝 Tips

1. **Test di device nyata** sebelum release
2. **Optimize assets** untuk ukuran APK kecil
3. **Gunakan ProGuard** untuk obfuscation
4. **Test offline mode** dengan IndexedDB

---

**Happy Building! 🚀**
