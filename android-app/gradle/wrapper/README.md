# Gradle Wrapper

Note: The gradle-wrapper.jar file is not included in this repository to keep it lightweight.

To generate the gradle-wrapper.jar, you need to:

1. Install Gradle on your system (version 7.5 or higher)
2. Run the following command in the android-app directory:
   ```
   gradle wrapper --gradle-version 7.5
   ```

Alternatively, if you have Android Studio installed:
1. Open the android-app project in Android Studio
2. Android Studio will automatically download and configure the Gradle wrapper

The gradle-wrapper.jar will be placed in the gradle/wrapper/ directory.

For more information about Gradle Wrapper, see:
https://docs.gradle.org/current/userguide/gradle_wrapper.html
