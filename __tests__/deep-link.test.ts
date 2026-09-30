import { toInternalRoute } from '@/lib/utils/deep-link';

describe('toInternalRoute', () => {
    it('maps a valid invite link to the signup route', () => {
        expect(toInternalRoute('https://example.com/signup?invite=abc-123')).toBe('/signup?invite=abc-123');
    });

    it('accepts a trailing slash', () => {
        expect(toInternalRoute('https://example.com/signup/?invite=abc')).toBe('/signup?invite=abc');
    });

    it('rejects non-https URLs', () => {
        expect(toInternalRoute('http://example.com/signup?invite=abc')).toBeNull();
        expect(toInternalRoute('javascript:alert(1)')).toBeNull();
    });

    it('rejects paths that are not allow-listed', () => {
        expect(toInternalRoute('https://example.com/profile?invite=abc')).toBeNull();
    });

    it('rejects links without an invite token', () => {
        expect(toInternalRoute('https://example.com/signup')).toBeNull();
        expect(toInternalRoute('https://example.com/signup?invite=')).toBeNull();
    });

    it('rejects garbage input', () => {
        expect(toInternalRoute('not a url')).toBeNull();
    });

    it('encodes unusual token characters', () => {
        expect(toInternalRoute('https://example.com/signup?invite=a%26b%3Dc')).toBe('/signup?invite=a%26b%3Dc');
    });
});
