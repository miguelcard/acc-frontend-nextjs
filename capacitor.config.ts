import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.avidhabits.app',
  appName: 'Accountability',
  webDir: 'out',
  server: {
    // Serve the app over http:// instead of https:// on Android.
    // This prevents "Mixed Content" errors when calling a local HTTP backend (10.0.2.2:8000).
    // Safe for development; for production the backend should use HTTPS and this can be removed.
    androidScheme: 'http',
    
    // clear (comment) the url key from production builds "(npm run cap:android-emulator)" otherwise the app will try to connect to your dev server instead of using the bundled files.
    url: 'http://10.0.2.2:3000',
    cleartext: true,
  },
};

export default config;
