import { getDisplayEmail } from '@/lib/utils/email';

describe('getDisplayEmail', () => {
    it('returns real emails unchanged', () => {
        expect(getDisplayEmail('me@example.com')).toBe('me@example.com');
    });

    it('hides the placeholder email of anonymous (guest) users', () => {
        expect(getDisplayEmail('abc123xyz@anonymous.firebase')).toBeNull();
        expect(getDisplayEmail('ABC@ANONYMOUS.FIREBASE')).toBeNull();
    });

    it('returns null for empty values', () => {
        expect(getDisplayEmail('')).toBeNull();
        expect(getDisplayEmail(null)).toBeNull();
        expect(getDisplayEmail(undefined)).toBeNull();
    });

    it('does not hide a real address that merely contains the word', () => {
        expect(getDisplayEmail('anonymous.firebase@gmail.com')).toBe('anonymous.firebase@gmail.com');
    });
});
