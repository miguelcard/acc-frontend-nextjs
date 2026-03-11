import { getIdToken } from '@/lib/auth/firebase-auth';

/**
 * A fetch wrapper that:
 * 1. Injects a fresh Firebase ID token (Authorization: Bearer …) into every request
 * 2. On a 401 response, force-refreshes the token and retries the request ONCE
 *
 * Use this instead of raw `fetch()` + `getAuthHeader()` for all authenticated API calls.
 */
export async function authenticatedFetch(
    input: RequestInfo | URL,
    init?: RequestInit
): Promise<Response> {
    // --- First attempt: use cached (or auto-refreshed) token ---
    const token = await getIdToken(false);
    const headers = new Headers(init?.headers);
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(input, { ...init, headers });

    // --- If 401, force-refresh the token and retry once ---
    if (response.status === 401) {
        const freshToken = await getIdToken(true); // forceRefresh = true
        if (freshToken) {
            headers.set('Authorization', `Bearer ${freshToken}`);
            return fetch(input, { ...init, headers });
        }
    }

    return response;
}
