'use client';

import { useEffect } from 'react';
import {
  hideSplash,
  configureStatusBar,
  registerBackButton,
  registerKeyboardListeners,
  markNativePlatform,
} from '@/lib/capacitor-plugins';

/**
 * Invisible component that bootstraps all Capacitor native plugins.
 * Drop it once inside RootLayout (or any top-level client boundary).
 *
 * Every plugin call is guarded with `Capacitor.isNativePlatform()`
 * so this is a harmless no-op when running in a normal browser.
 */
export default function CapacitorPluginsInit() {
  useEffect(() => {
    // Add CSS class marker for native platform (enables safe area styles)
    markNativePlatform();

    // Status bar styling
    configureStatusBar();

    // Hide the native splash screen now that the React tree has mounted
    hideSplash();

    // Android hardware back button
    const removeBack = registerBackButton();

    // Keyboard show/hide CSS class
    const removeKeyboard = registerKeyboardListeners();

    return () => {
      removeBack();
      removeKeyboard();
    };
  }, []);

  return null; // renders nothing
}
