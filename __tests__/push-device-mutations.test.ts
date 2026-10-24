const mockAuthenticatedFetch = jest.fn();

jest.mock('@/lib/authenticated-fetch', () => ({ authenticatedFetch: mockAuthenticatedFetch }));
// fetch-mutations transitively imports lib/firebase, which initialises the real Firebase SDK
// (needs an API key). The code under test never touches it, so replace it.
jest.mock('@/lib/firebase', () => ({ app: {}, auth: {} }));
jest.mock('@/lib/auth/firebase-auth', () => ({}));

import { registerDeviceToken, unregisterDeviceToken } from '@/lib/fetch-mutations';

beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_API = 'https://api.test';
});

describe('registerDeviceToken', () => {
    it('POSTs the token and platform as JSON to the devices endpoint', async () => {
        mockAuthenticatedFetch.mockResolvedValue({ ok: true });
        const ok = await registerDeviceToken('tok-1', 'android');

        expect(ok).toBe(true);
        const [url, init] = mockAuthenticatedFetch.mock.calls[0];
        expect(url).toMatch(/\/v1\/devices\/$/);
        expect(init.method).toBe('POST');
        expect(JSON.parse(init.body)).toEqual({ token: 'tok-1', platform: 'android' });
    });

    it('returns false when the backend rejects the request', async () => {
        mockAuthenticatedFetch.mockResolvedValue({ ok: false });
        expect(await registerDeviceToken('tok-1', 'android')).toBe(false);
    });

    it('returns false instead of throwing on a network error', async () => {
        mockAuthenticatedFetch.mockRejectedValue(new Error('offline'));
        await expect(registerDeviceToken('tok-1', 'android')).resolves.toBe(false);
    });
});

describe('unregisterDeviceToken', () => {
    it('sends DELETE with only the token in the body', async () => {
        mockAuthenticatedFetch.mockResolvedValue({ ok: true });
        const ok = await unregisterDeviceToken('tok-1');

        expect(ok).toBe(true);
        const [url, init] = mockAuthenticatedFetch.mock.calls[0];
        expect(url).toMatch(/\/v1\/devices\/$/);
        expect(init.method).toBe('DELETE');
        expect(JSON.parse(init.body)).toEqual({ token: 'tok-1' });
    });

    it('returns false instead of throwing on a network error', async () => {
        mockAuthenticatedFetch.mockRejectedValue(new Error('offline'));
        await expect(unregisterDeviceToken('tok-1')).resolves.toBe(false);
    });
});
