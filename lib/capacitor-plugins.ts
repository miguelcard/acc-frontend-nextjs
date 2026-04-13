'use client';

import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App } from '@capacitor/app';

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
 * Tracks keyboard visibility and height using `window.visualViewport`.
 *
 * With `KeyboardResize.None` (capacitor.config.ts) and `adjustNothing`
 * (AndroidManifest), the WebView is never auto-resized by either Capacitor
 * or Android. When the keyboard opens:
 *   - `window.innerHeight` stays constant (full WebView height)
 *   - `window.visualViewport.height` shrinks to the available space above the keyboard
 *   - keyboard height = `window.innerHeight − visualViewport.height`
 *
 * This is the most reliable detection method on Android WebView.
 * On iOS, visualViewport also reflects the keyboard correctly.
 *
 * Sets:
 *   - `body.keyboard-open` class while the keyboard is visible
 *   - `--keyboard-height` CSS custom property on `<html>` with the pixel height
 *
 * Returns a cleanup function to remove the listener.
 */
export function registerKeyboardListeners(): () => void {
  if (!isNative) return () => {};
  if (typeof window === 'undefined' || !window.visualViewport) return () => {};

  const vv = window.visualViewport;

  // Minimum px change to treat as keyboard open (avoids false positives
  // from browser chrome / URL bar animation on scroll).
  const KEYBOARD_THRESHOLD_PX = 100;

  const onViewportResize = () => {
    const keyboardHeight = window.innerHeight - vv.height;

    if (keyboardHeight > KEYBOARD_THRESHOLD_PX) {
      document.body.classList.add('keyboard-open');
      document.documentElement.style.setProperty('--keyboard-height', `${keyboardHeight}px`);

      // Scroll the focused input into view, but ONLY within its
      // scrollable dialog content — never scroll the body/html which
      // would shift the entire fixed-position dialog.
      setTimeout(() => {
        const active = document.activeElement as HTMLElement | null;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
          // Find the closest MUI DialogContent scroll container
          const scrollParent = active.closest('.MuiDialogContent-root');
          if (scrollParent) {
            // Scroll within the dialog content only
            const parentRect = scrollParent.getBoundingClientRect();
            const activeRect = active.getBoundingClientRect();
            const offset = activeRect.top - parentRect.top - parentRect.height / 2 + activeRect.height / 2;
            scrollParent.scrollBy({ top: offset, behavior: 'smooth' });
          }
          // For non-dialog inputs (e.g. standalone pages): do nothing —
          // the CSS --keyboard-height padding handles it.
        }
      }, 150);
    } else {
      document.body.classList.remove('keyboard-open');
      document.documentElement.style.setProperty('--keyboard-height', '0px');
    }
  };

  vv.addEventListener('resize', onViewportResize);

  return () => {
    vv.removeEventListener('resize', onViewportResize);
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
