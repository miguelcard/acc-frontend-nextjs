'use client';

import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import type { PluginListenerHandle } from '@capacitor/core';
import { registerDeviceToken, unregisterDeviceToken } from '@/lib/fetch-mutations';

/**
 * Push is enabled on Android only for now (iOS needs an APNs key, see openspec change
 * `push-notifications`, task 4.1).
 */
function isPushSupported(): boolean {
    return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
}

/** Last FCM token registered on the backend by this app session (needed for logout). */
let currentToken: string | null = null;

/**
 * Asks for notification permission (if not decided yet), then registers with FCM and
 * posts the resulting token to the backend. Token refreshes are re-posted.
 * Returns a cleanup function that removes the listeners. No-op outside Android.
 */
export async function initPushRegistration(): Promise<() => void> {
    if (!isPushSupported()) return () => {};

    const handles: PluginListenerHandle[] = [];
    try {
        handles.push(
            await PushNotifications.addListener('registration', async ({ value }) => {
                currentToken = value;
                await registerDeviceToken(value, 'android');
            }),
            await PushNotifications.addListener('registrationError', (error) => {
                console.warn('Push registration failed:', error);
            }),
        );

        let { receive } = await PushNotifications.checkPermissions();
        if (receive === 'prompt' || receive === 'prompt-with-rationale') {
            ({ receive } = await PushNotifications.requestPermissions());
        }
        if (receive === 'granted') {
            await PushNotifications.register();
        }
    } catch (error) {
        console.warn('Push setup failed:', error);
    }

    return () => {
        handles.forEach((h) => h.remove().catch(() => {}));
    };
}

/**
 * Removes this device's token from the backend and from FCM. Best effort: never throws,
 * so it can never block sign-out. Must be called while the user is still authenticated.
 */
export async function unregisterPush(): Promise<void> {
    if (!isPushSupported() || !currentToken) return;
    const token = currentToken;
    currentToken = null;
    try {
        await unregisterDeviceToken(token);
        await PushNotifications.unregister();
    } catch {
        // Stale tokens are re-assigned on next registration and pruned by the backend.
    }
}
