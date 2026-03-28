import { getIdToken } from '@/lib/auth/firebase-auth';

const REQUEST_TIMEOUT_MS = 9000;

/**
 * A fetch wrapper that:
 * 1. Injects a fresh Firebase ID token (Authorization: Bearer …) into every request
 * 2. On a 401 response, force-refreshes the token and retries the request ONCE
 * 3. Aborts requests that take longer than REQUEST_TIMEOUT_MS (default 8s)
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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let response: Response;
    try {
        response = await fetch(input, { ...init, headers, signal: controller.signal });
    } finally {
        clearTimeout(timeoutId);
    }

    // --- If 401, force-refresh the token and retry once ---
    if (response.status === 401) {
        const freshToken = await getIdToken(true); // forceRefresh = true
        if (freshToken) {
            headers.set('Authorization', `Bearer ${freshToken}`);
            const retryController = new AbortController();
            const retryTimeoutId = setTimeout(() => retryController.abort(), REQUEST_TIMEOUT_MS);
            try {
                return await fetch(input, { ...init, headers, signal: retryController.signal });
            } finally {
                clearTimeout(retryTimeoutId);
            }
        }
    }

    return response;
}
