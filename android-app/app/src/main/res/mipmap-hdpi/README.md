# App Icons

This directory should contain the app launcher icons in various densities:

- mipmap-mdpi/ic_launcher.png (48x48 dp)
- mipmap-hdpi/ic_launcher.png (72x72 dp)
- mipmap-xhdpi/ic_launcher.png (96x96 dp)
- mipmap-xxhdpi/ic_launcher.png (144x144 dp)
- mipmap-xxxhdpi/ic_launcher.png (192x192 dp)

## How to Generate Icons

You can generate app icons using:

1. **Android Studio's Image Asset Studio**:
   - Right-click on `res` folder
   - New > Image Asset
   - Choose Icon Type: Launcher Icons
   - Upload your icon image
   - Android Studio will generate all densities automatically

2. **Online Tools**:
   - https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html
   - https://icon.kitchen/

3. **Manual Creation**:
   - Create PNG images in the sizes mentioned above
   - Place them in the respective mipmap directories
   - Ensure the filename is exactly `ic_launcher.png`

## Default Icon

For now, the app will use the default Android launcher icon. Replace it with a custom icon for better branding.
