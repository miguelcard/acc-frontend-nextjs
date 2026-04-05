'use client';

import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App } from '@capacitor/app';
import { Keyboard } from '@capacitor/keyboard';

/**
 * Returns true when running inside a native Capacitor shell (Android / iOS).
 * All plugin calls below are guarded so they are no-ops on the web.
 */
const isNative = Capacitor.isNativePlatform();

/* ------------------------------------------------------------------ */
/*  Splash Screen                                                     */
/* ------------------------------------------------------------------ */

/**
 * Call once after your first meaningful paint (e.g. after auth check
 * finishes) to dismiss the native splash screen.
 */
export async function hideSplash() {
  if (!isNative) return;
  try {
    await SplashScreen.hide({ fadeOutDuration: 300 });
  } catch {
    // Plugin might not be available on every platform build
  }
}

/* ------------------------------------------------------------------ */
/*  Status Bar                                                        */
/* ------------------------------------------------------------------ */

/**
 * Apply the preferred status bar style.
 * Called once at app boot.
 */
export async function configureStatusBar() {
  if (!isNative) return;
  try {
    // Light content (white icons) over the primary colour background
    await StatusBar.setStyle({ style: Style.Light });
    // Only Android supports setBackgroundColor
    if (Capacitor.getPlatform() === 'android') {
      await StatusBar.setBackgroundColor({ color: '#84cec1' });
    }
    await StatusBar.setOverlaysWebView({ overlay: false });
  } catch {
    // Graceful no-op
  }
}

/* ------------------------------------------------------------------ */
/*  Hardware Back Button (Android)                                    */
/* ------------------------------------------------------------------ */

/**
 * Register the Android hardware back-button handler.
 * - If there is browser history → go back.
 * - Otherwise → minimise (don't close) the app.
 *
 * Returns a cleanup function to remove the listener.
 */
export function registerBackButton(): () => void {
  if (!isNative) return () => {};

  const handler = App.addListener('backButton', ({ canGoBack }) => {
    if (canGoBack) {
      window.history.back();
    } else {
      // Minimise the app instead of exiting
      App.minimizeApp();
    }
  });

  return () => {
    handler.then((h) => h.remove());
  };
}

/* ------------------------------------------------------------------ */
/*  Keyboard                                                          */
/* ------------------------------------------------------------------ */

/**
 * Add a CSS class to <body> while the soft keyboard is visible so you
 * can adjust padding / layout via CSS if needed.
 *
 * Returns a cleanup function to remove the listeners.
 */
export function registerKeyboardListeners(): () => void {
  if (!isNative) return () => {};

  const showHandler = Keyboard.addListener('keyboardWillShow', () => {
    document.body.classList.add('keyboard-open');
  });

  const hideHandler = Keyboard.addListener('keyboardWillHide', () => {
    document.body.classList.remove('keyboard-open');
  });

  return () => {
    showHandler.then((h) => h.remove());
    hideHandler.then((h) => h.remove());
  };
}

/* ------------------------------------------------------------------ */
/*  Native Platform Marker                                            */
/* ------------------------------------------------------------------ */

/**
 * Add a CSS class to <body> when running inside a native Capacitor shell.
 * This allows CSS to target native-only styles (e.g., safe area insets).
 */
export function markNativePlatform(): void {
  if (!isNative) return;
  document.body.classList.add('capacitor-native');
}
