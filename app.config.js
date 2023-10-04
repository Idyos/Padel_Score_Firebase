import 'dotenv/config';
export default {

  "expo": {
    "name": "Padel_Score",
    "slug": "Padel_Score",
    "version": "2.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos to let you share them with your friends.",
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera",
        }
      ]
    ],
    "updates": {
      "url": "https://u.expo.dev/40844559-0dac-4cb0-b72a-205eeee065ba"
    },
    "runtimeVersion": {
      "policy": "sdkVersion"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "package": "com.javigamo.padelscore",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      eas: {
        "projectId": "40844559-0dac-4cb0-b72a-205eeee065ba",
      }
    }
  }
}
