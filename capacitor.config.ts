import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';
import { Style as StatusBarStyle } from '@capacitor/status-bar';

// When CAP_LIVE_RELOAD=true, the app connects to your local dev server
// instead of using the bundled static files.
const liveReload = process.env.CAP_LIVE_RELOAD === 'true';

const config: CapacitorConfig = {
  appId: 'com.avidhabits.app',
  appName: 'Accountability',
  webDir: 'out',
  server: {
    // Serve the app over http:// instead of https:// on Android.
    // This prevents "Mixed Content" errors when calling a local HTTP backend (10.0.2.2:8000).
    // Safe for development; for production the backend should use HTTPS and this can be removed.
    androidScheme: 'http',

    // Live-reload: point the app at your Next.js dev server.
    // Automatically set by `npm run cap:live-reload`.
    ...(liveReload ? { url: 'http://10.0.2.2:3000', cleartext: true } : {}),
  },
  plugins: {
    SplashScreen: {
      // How long to show the native splash before auto-hiding (ms).
      // Set to 0 and call SplashScreen.hide() manually for more control.
      launchAutoHide: true,
      launchShowDuration: 2000,
      backgroundColor: '#84cec1', // matches your primary color
      showSpinner: false,
      // Android-only: use the full-screen splash layout
      splashFullScreen: false,
      splashImmersive: false,
    },
    Keyboard: {
      // Do NOT let Capacitor auto-resize anything — we reposition dialogs
      // ourselves via CSS (--keyboard-height + .keyboard-open class).
      // Combined with adjustNothing in AndroidManifest this gives us full control.
      resize: KeyboardResize.None,
      style: KeyboardStyle.Light,
    },
    StatusBar: {
      // Match the primary/navbar color for a seamless look
      backgroundColor: '#84cec1',
      style: StatusBarStyle.Light,    // light text on the status bar
      overlaysWebView: false,
    },
  },
};

export default config;
