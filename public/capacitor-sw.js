/**
 * Service Worker for SPA routing fallback in Capacitor.
 *
 * Problem: Next.js static export only generates HTML/RSC files for paths
 * listed in generateStaticParams (e.g., /spaces/_). When client-side
 * navigation tries to load /spaces/75, the RSC payload (/spaces/75.txt)
 * and HTML (/spaces/75.html) don't exist. This causes a full-page
 * fallback to index.html (the landing page).
 *
 * Solution: This SW intercepts requests for dynamic routes and serves
 * the catch-all page's files instead. The catch-all page is fully
 * client-rendered (reads the ID from the URL via useParams), so
 * serving the same HTML/RSC payload works for any ID.
 */

// Activate immediately, don't wait for old SW to stop
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

/**
 * Map of dynamic route patterns to their catch-all file equivalents.
 * Each entry: [RegExp for the request path, replacement path to serve]
 */
const ROUTE_FALLBACKS = [
    // /spaces/{id}.txt (RSC payload) → /spaces/_.txt
    { match: /^\/spaces\/(\d+)\.txt$/, fallback: '/spaces/_.txt' },
    // /spaces/{id}/members.txt (RSC payload) → /spaces/_/members.txt
    { match: /^\/spaces\/(\d+)\/members\.txt$/, fallback: '/spaces/_/members.txt' },
    // /spaces/{id}/members (HTML) → /spaces/_/members.html
    { match: /^\/spaces\/(\d+)\/members$/, fallback: '/spaces/_/members.html' },
    // /spaces/{id} (HTML) → /spaces/_.html
    { match: /^\/spaces\/(\d+)$/, fallback: '/spaces/_.html' },
];

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Only handle same-origin requests (Capacitor's local server)
    if (url.origin !== self.location.origin) return;

    // Strip query string for matching (e.g., ?_rsc=xxx)
    const pathname = url.pathname;

    for (const route of ROUTE_FALLBACKS) {
        if (route.match.test(pathname)) {
            event.respondWith(
                // Try the original URL first (in case the file exists)
                fetch(event.request).then((response) => {
                    // If the original request succeeded (2xx), return it
                    if (response.ok) return response;
                    // Otherwise, serve the catch-all fallback
                    return fetch(route.fallback);
                }).catch(() => {
                    // Network error → serve fallback
                    return fetch(route.fallback);
                })
            );
            return;
        }
    }
});
