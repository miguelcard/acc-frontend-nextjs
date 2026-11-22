/**
 * @jest-environment jsdom
 */
import { FirebaseError } from 'firebase/app';

const mockSendEmailVerification = jest.fn();
let mockCurrentUser: Record<string, unknown> | null = null;

jest.mock('firebase/auth', () => ({
    signInAnonymously: jest.fn(),
    onAuthStateChanged: jest.fn(),
    signOut: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    sendEmailVerification: (...args: unknown[]) => mockSendEmailVerification(...args),
    linkWithCredential: jest.fn(),
    EmailAuthProvider: { credential: jest.fn() },
}));
// Getter so the factory does not read `mockCurrentUser` before it is initialised.
jest.mock('@/lib/firebase', () => ({
    get auth() {
        return { currentUser: mockCurrentUser };
    },
}));

import { sendVerificationEmail, reloadCurrentUser } from '@/lib/auth/firebase-auth';
import { getAuthErrorMessage } from '@/lib/auth/auth-errors';

describe('sendVerificationEmail', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockCurrentUser = null;
    });

    it('rejects when there is no user session', async () => {
        await expect(sendVerificationEmail()).rejects.toThrow(/no user session/i);
        expect(mockSendEmailVerification).not.toHaveBeenCalled();
    });

    it('rejects for anonymous users (nothing to verify)', async () => {
        mockCurrentUser = { isAnonymous: true, email: null };
        await expect(sendVerificationEmail()).rejects.toThrow(/no email/i);
        expect(mockSendEmailVerification).not.toHaveBeenCalled();
    });

    it('rejects when the user has no email', async () => {
        mockCurrentUser = { isAnonymous: false, email: null };
        await expect(sendVerificationEmail()).rejects.toThrow(/no email/i);
    });

    it('asks Firebase to send the verification link for a registered user', async () => {
        mockCurrentUser = { isAnonymous: false, email: 'me@example.com' };
        mockSendEmailVerification.mockResolvedValue(undefined);
        await sendVerificationEmail();
        expect(mockSendEmailVerification).toHaveBeenCalledWith(mockCurrentUser);
    });

    it('propagates Firebase errors such as rate limiting', async () => {
        mockCurrentUser = { isAnonymous: false, email: 'me@example.com' };
        mockSendEmailVerification.mockRejectedValue(new FirebaseError('auth/too-many-requests', 'slow down'));
        await expect(sendVerificationEmail()).rejects.toMatchObject({ code: 'auth/too-many-requests' });
    });
});

describe('reloadCurrentUser', () => {
    beforeEach(() => {
        mockCurrentUser = null;
    });

    it('rejects when there is no user session', async () => {
        await expect(reloadCurrentUser()).rejects.toThrow(/no user session/i);
    });

    it('reloads the user and returns it', async () => {
        const reload = jest.fn().mockResolvedValue(undefined);
        mockCurrentUser = { reload, emailVerified: true };
        await expect(reloadCurrentUser()).resolves.toBe(mockCurrentUser);
        expect(reload).toHaveBeenCalledTimes(1);
    });
});

describe('getAuthErrorMessage', () => {
    it.each([
        ['auth/wrong-password', /incorrect email or password/i],
        ['auth/invalid-credential', /incorrect email or password/i],
        ['auth/user-not-found', /incorrect email or password/i],
        ['auth/weak-password', /at least 6 characters/i],
        ['auth/invalid-email', /valid email/i],
        ['auth/too-many-requests', /too many attempts/i],
        ['auth/network-request-failed', /network error/i],
        ['auth/user-disabled', /disabled/i],
        ['auth/something-new', /something went wrong/i],
    ])('maps %s', (code, message) => {
        expect(getAuthErrorMessage(new FirebaseError(code, 'x'))).toMatch(message);
    });

    it('falls back for non-Firebase errors', () => {
        expect(getAuthErrorMessage(new Error('boom'))).toMatch(/something went wrong/i);
        expect(getAuthErrorMessage(undefined)).toMatch(/something went wrong/i);
    });
});
