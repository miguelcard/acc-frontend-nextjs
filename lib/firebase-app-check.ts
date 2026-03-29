/**
 * Firebase App Check initialization.
 *
 * App Check verifies that requests come from your genuine app,
 * not from scripts or tampered clients.
 *
 * - In **development**: uses the Debug Provider so you don't need reCAPTCHA.
 *   A debug token is printed to the browser console — register it in
 *   Firebase Console → App Check → Apps → Manage debug tokens.
 *
 * - In **production web**: uses reCAPTCHA v3 (free, no billing required).
 *   Requires NEXT_PUBLIC_FIREBASE_APPCHECK_RECAPTCHA_SITE_KEY in .env.local.
 *   Get the site key from: https://www.google.com/recaptcha/admin/create
 *   (choose "reCAPTCHA v3", add your domain)
 *
 * - For **Capacitor (Android/iOS)**: native App Check providers
 *   (Play Integrity / DeviceCheck) need a Capacitor plugin.
 *   TODO: integrate a native Capacitor App Check plugin when shipping native builds.
 *
 * Call `initializeAppCheck()` once at app startup, before any API calls.
 */

import {
    initializeAppCheck as firebaseInitializeAppCheck,
    getToken,
    ReCaptchaV3Provider,
    AppCheck,
} from 'firebase/app-check';
import { app } from '@/lib/firebase';

let appCheckInstance: AppCheck | null = null;

/**
 * Initializes Firebase App Check.
 * Safe to call multiple times — only initializes once.
 */
export function initializeAppCheck(): void {
    if (appCheckInstance) return;

    // Capacitor native platforms: skip for now.
    // reCAPTCHA Enterprise won't work inside a native WebView.
    // TODO: Use a native Capacitor App Check plugin for Android (Play Integrity)
    //       and iOS (DeviceCheck / App Attest) in production Capacitor builds.
    if (typeof window !== 'undefined' && 'Capacitor' in window) {
        const cap = (window as Record<string, unknown>).Capacitor as { isNativePlatform?: () => boolean } | undefined;
        if (cap?.isNativePlatform?.()) {
            console.info('[AppCheck] Skipping App Check on native Capacitor platform (not yet implemented).');
            return;
        }
    }

    const isDevMode = process.env.NODE_ENV === 'development';
    const siteKey = process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_RECAPTCHA_SITE_KEY;

    if (isDevMode) {
        // Enable the debug provider for local development.
        // This sets a global that the Firebase SDK reads before initialization.
        // The debug token will be printed to the browser console.
        // Register it in Firebase Console → App Check → Apps → Manage debug tokens.
        (self as unknown as Record<string, unknown>).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
        console.info('[AppCheck] Debug provider enabled (development mode).');
    }

    if (!isDevMode && !siteKey) {
        console.warn(
            '[AppCheck] NEXT_PUBLIC_FIREBASE_APPCHECK_RECAPTCHA_SITE_KEY is not set. ' +
            'App Check will NOT be initialized in production. ' +
            'Get your reCAPTCHA v3 site key at https://www.google.com/recaptcha/admin/create ' +
            'and add it to .env.local.'
        );
        return;
    }

    try {
        appCheckInstance = firebaseInitializeAppCheck(app, {
            provider: new ReCaptchaV3Provider(
                // In debug mode the site key is unused but must be a non-empty string
                siteKey || 'debug-placeholder'
            ),
            isTokenAutoRefreshEnabled: true,
        });
        console.info('[AppCheck] Initialized successfully.');
    } catch (error) {
        console.error('[AppCheck] Initialization failed:', error);
    }
}

/**
 * Returns a fresh App Check token string to attach to API requests.
 * Returns null if App Check is not initialized (e.g., native platform, missing config).
 */
export async function getAppCheckToken(): Promise<string | null> {
    if (!appCheckInstance) return null;

    try {
        const result = await getToken(appCheckInstance, /* forceRefresh */ false);
        return result.token;
    } catch (error) {
        console.warn('[AppCheck] Failed to get token:', error);
        return null;
    }
}
