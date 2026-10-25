import { getUsernameEmailSuggestions } from '@/lib/fetch-mutations';
import { authenticatedFetch } from '@/lib/authenticated-fetch';

jest.mock('@/lib/authenticated-fetch', () => ({
    authenticatedFetch: jest.fn(),
}));
jest.mock('@/lib/firebase', () => ({ app: {}, auth: {} }));
jest.mock('@/lib/auth/firebase-auth', () => ({}));

const mockFetch = authenticatedFetch as jest.Mock;

describe('getUsernameEmailSuggestions', () => {
    beforeEach(() => {
        process.env.NEXT_PUBLIC_API = 'http://api.test/api';
        mockFetch.mockReset();
        mockFetch.mockResolvedValue({ ok: true, json: async () => ({ results: [] }) });
    });

    it('url-encodes the search term so emails with + or & do not break the query string', async () => {
        await getUsernameEmailSuggestions('a+b&c@x.com', 5);

        const url: string = mockFetch.mock.calls[0][0];
        expect(url).toBe('http://api.test/api/v1/users/usernames-emails/?search=a%2Bb%26c%40x.com&page_size=5');
    });

    it('leaves plain usernames readable', async () => {
        await getUsernameEmailSuggestions('miggy', 5);

        expect(mockFetch.mock.calls[0][0]).toContain('?search=miggy&page_size=5');
    });

    it('returns a generic error object when the request fails', async () => {
        mockFetch.mockResolvedValue({ ok: false, json: async () => ({ detail: 'nope' }) });

        const result = await getUsernameEmailSuggestions('miggy', 5);

        expect(result.error).toBeTruthy();
    });
});
