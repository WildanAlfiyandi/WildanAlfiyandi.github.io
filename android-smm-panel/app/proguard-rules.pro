# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /sdk/tools/proguard/proguard-android.txt

# Keep model classes
-keep class com.smmpanel.app.** { *; }

# Keep RecyclerView adapters
-keep class * extends androidx.recyclerview.widget.RecyclerView$Adapter { *; }

# Keep ViewHolders
-keep class * extends androidx.recyclerview.widget.RecyclerView$ViewHolder { *; }
