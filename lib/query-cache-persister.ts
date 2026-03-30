/**
 * Capacitor-based persister for TanStack Query cache.
 *
 * On native (Android / iOS) the React Query cache is serialised to
 * `@capacitor/preferences` (SharedPreferences on Android, UserDefaults
 * on iOS).  This lets the app show previously-fetched data instantly
 * on launch — even when offline.
 *
 * On the web this module is a no-op; the cache lives only in memory.
 *
 * How it works:
 *   1. `PersistQueryClient` (from @tanstack/react-query-persist-client)
 *      calls `persister.persistClient(client)` whenever the in-memory
 *      cache changes (debounced by TanStack internally — default 1 s).
 *   2. On startup it calls `persister.restoreClient()` to hydrate
 *      the QueryClient from disk before rendering.
 *   3. A `maxAge` (24 h) is set so stale data is discarded rather than
 *      shown forever.
 */

import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import type { PersistedClient, Persister } from '@tanstack/react-query-persist-client';

const CACHE_KEY = 'REACT_QUERY_OFFLINE_CACHE';

/**
 * Returns true when running inside a native Capacitor shell (Android / iOS).
 */
const isNative = Capacitor.isNativePlatform();

/**
 * Creates a Persister backed by @capacitor/preferences.
 * All methods are no-ops when running on the web.
 */
export function createCapacitorPersister(): Persister {
    return {
        persistClient: async (client: PersistedClient) => {
            if (!isNative) return;
            try {
                await Preferences.set({
                    key: CACHE_KEY,
                    value: JSON.stringify(client),
                });
            } catch (err) {
                console.warn('[QueryCachePersister] Failed to persist cache:', err);
            }
        },

        restoreClient: async (): Promise<PersistedClient | undefined> => {
            if (!isNative) return undefined;
            try {
                const { value } = await Preferences.get({ key: CACHE_KEY });
                if (!value) return undefined;
                return JSON.parse(value) as PersistedClient;
            } catch (err) {
                console.warn('[QueryCachePersister] Failed to restore cache:', err);
                return undefined;
            }
        },

        removeClient: async () => {
            if (!isNative) return;
            try {
                await Preferences.remove({ key: CACHE_KEY });
            } catch (err) {
                console.warn('[QueryCachePersister] Failed to remove cache:', err);
            }
        },
    };
}
