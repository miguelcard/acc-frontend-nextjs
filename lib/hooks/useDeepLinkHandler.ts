'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { toInternalRoute } from '@/lib/utils/deep-link';

/**
 * On a cold start the same link can arrive twice (getLaunchUrl + the retained
 * appUrlOpen event), and dev StrictMode mounts effects twice. Ignore an
 * identical route received within this window.
 */
const DUPLICATE_WINDOW_MS = 2000;

let lastRoute: string | null = null;
let lastHandledAt = 0;

/**
 * Routes native deep links (iOS Universal Links / Android App Links) to the
 * matching in-app page. Handles cold start (getLaunchUrl) and warm start
 * (appUrlOpen). No-op on the web.
 */
export function useDeepLinkHandler() {
    const router = useRouter();

    useEffect(() => {
        if (!Capacitor.isNativePlatform()) return;

        const handleUrl = (rawUrl: string) => {
            const route = toInternalRoute(rawUrl);
            if (!route) return;

            const now = Date.now();
            if (route === lastRoute && now - lastHandledAt < DUPLICATE_WINDOW_MS) return;
            lastRoute = route;
            lastHandledAt = now;

            router.push(route);
        };

        App.getLaunchUrl().then((launch) => {
            if (launch?.url) handleUrl(launch.url);
        });

        const listener = App.addListener('appUrlOpen', ({ url }) => handleUrl(url));

        return () => {
            listener.then((h) => h.remove());
        };
    }, [router]);
}
