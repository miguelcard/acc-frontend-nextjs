'use client';
import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { useState } from 'react';
import { createCapacitorPersister } from '@/lib/query-cache-persister';

/** Cache persisted to @capacitor/preferences survives up to 24 hours. */
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Provides the React Query QueryClient to the component tree.
 *
 * On native (Android / iOS) the cache is persisted to device storage
 * via @capacitor/preferences so previously-fetched data is available
 * immediately on launch — even when offline.
 *
 * On the web, persistence is skipped; the cache lives only in memory.
 *
 * `gcTime` must be >= `maxAge` so entries are not garbage-collected
 * before the persister has a chance to restore them.
 */
export default function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        networkMode: 'offlineFirst', // use cache first, fetch in background — critical for offline support
                        staleTime: 2 * 60 * 1000,   // 2 minutes
                        gcTime: CACHE_MAX_AGE_MS,    // keep entries for 24 h (must be >= persister maxAge)
                        retry: 1,                    // 1 retry = 2 total attempts (each times out at 8s)
                        retryDelay: 1000,            // wait 1s between attempts
                        refetchOnWindowFocus: false,
                    },
                },
            }),
    );

    const [persister] = useState(() => createCapacitorPersister());

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{
                persister,
                maxAge: CACHE_MAX_AGE_MS,
                /**
                 * Buster string — bump this when the shape of cached data
                 * changes (e.g., after a breaking API change) to force a
                 * full cache discard.
                 */
                buster: 'v1',
            }}
        >
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </PersistQueryClientProvider>
    );
}
