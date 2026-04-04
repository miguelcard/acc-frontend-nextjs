'use client';

import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Network } from '@capacitor/network';

/**
 * Returns `true` when online, `false` when offline.
 *
 * On native (Android / iOS) this uses `@capacitor/network` which calls
 * the platform's ConnectivityManager / NWPathMonitor — these correctly
 * detect airplane mode, WiFi-off, etc.
 *
 * `navigator.onLine` is NOT reliable in Android WebView (it can stay
 * `true` even in airplane mode because loopback counts as a network
 * interface), which is why the native plugin is required.
 *
 * On the web, falls back to `navigator.onLine` + browser events.
 */
export function useNetworkStatus(): boolean {
    // Start optimistic — assume online until we hear otherwise.
    // This prevents a flash of the offline banner on app boot.
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        if (Capacitor.isNativePlatform()) {
            // ---- Native: use @capacitor/network ----
            // Get the current status immediately
            Network.getStatus().then((status) => {
                setIsOnline(status.connected);
            });

            // Listen for changes
            const listener = Network.addListener('networkStatusChange', (status) => {
                setIsOnline(status.connected);
            });

            return () => {
                listener.then((handle) => handle.remove());
            };
        } else {
            // ---- Web fallback: browser events ----
            setIsOnline(navigator.onLine);

            const goOnline = () => setIsOnline(true);
            const goOffline = () => setIsOnline(false);

            window.addEventListener('online', goOnline);
            window.addEventListener('offline', goOffline);

            return () => {
                window.removeEventListener('online', goOnline);
                window.removeEventListener('offline', goOffline);
            };
        }
    }, []);

    return isOnline;
}
