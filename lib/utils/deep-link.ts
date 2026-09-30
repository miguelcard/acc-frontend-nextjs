/** Only these paths may be opened from an external link. */
const ALLOWED_PATHS = ['/signup'];

/**
 * Converts an incoming universal/app link into an in-app route.
 * Returns null if the URL is not an allowed https invite link.
 */
export function toInternalRoute(rawUrl: string): string | null {
    try {
        const url = new URL(rawUrl);
        if (url.protocol !== 'https:') return null;
        const path = url.pathname.replace(/\/+$/, '') || '/';
        if (!ALLOWED_PATHS.includes(path)) return null;
        const invite = url.searchParams.get('invite');
        if (!invite) return null;
        return `${path}?invite=${encodeURIComponent(invite)}`;
    } catch {
        return null;
    }
}
