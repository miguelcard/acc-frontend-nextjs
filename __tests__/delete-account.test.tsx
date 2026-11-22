/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FirebaseError } from 'firebase/app';

// ---- mocks ----
const mockReauthenticateWithCredential = jest.fn();
const mockCredential = jest.fn((email: string, password: string) => ({ email, password }));
let mockCurrentUser: Record<string, unknown> | null = null;
jest.mock('firebase/auth', () => ({
    signInAnonymously: jest.fn(),
    onAuthStateChanged: jest.fn(),
    signOut: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    sendEmailVerification: jest.fn(),
    linkWithCredential: jest.fn(),
    reauthenticateWithCredential: (...args: unknown[]) => mockReauthenticateWithCredential(...args),
    EmailAuthProvider: { credential: (...args: [string, string]) => mockCredential(...args) },
}));
jest.mock('@/lib/firebase', () => ({
    get auth() {
        return { currentUser: mockCurrentUser };
    },
}));

const mockAuthenticatedFetch = jest.fn();
jest.mock('@/lib/authenticated-fetch', () => ({
    authenticatedFetch: (...args: unknown[]) => mockAuthenticatedFetch(...args),
}));

const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({ useRouter: () => ({ replace: mockReplace, push: jest.fn() }) }));

const mockToast = Object.assign(jest.fn(), { success: jest.fn(), error: jest.fn() });
jest.mock('react-hot-toast', () => ({ __esModule: true, default: mockToast }));

const mockCancelQueries = jest.fn();
const mockClear = jest.fn();
jest.mock('@tanstack/react-query', () => ({
    useQueryClient: () => ({ cancelQueries: mockCancelQueries, clear: mockClear }),
}));

const callOrder: string[] = [];
const mockUnregisterPush = jest.fn();
jest.mock('@/lib/push-notifications', () => ({ unregisterPush: () => mockUnregisterPush() }));

let mockIsAnonymous: boolean | null = false;
const mockReauthenticate = jest.fn();
const mockSignOut = jest.fn();
const mockSendPasswordReset = jest.fn();
jest.mock('@/lib/auth/auth-context', () => ({
    useAuth: () => ({
        isAnonymous: mockIsAnonymous,
        user: { email: 'me@example.com' },
        reauthenticate: mockReauthenticate,
        signOut: mockSignOut,
        sendPasswordReset: mockSendPasswordReset,
    }),
}));

const mockDeleteAccount = jest.fn();
jest.mock('@/lib/fetch-mutations', () => {
    const actual = jest.requireActual('@/lib/fetch-mutations');
    return { ...actual, deleteAccount: (...args: unknown[]) => mockDeleteAccount(...args) };
});

import { reauthenticateWithPassword } from '@/lib/auth/firebase-auth';
import { DeleteAccountForm, DELETE_CONFIRMATION_WORD } from '@/components/profile/ChangeUserFields/delete-account-form';

// ---- reauthenticateWithPassword ----

describe('reauthenticateWithPassword', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockCurrentUser = null;
    });

    it('rejects without a user session', async () => {
        await expect(reauthenticateWithPassword('pw')).rejects.toThrow(/no user session/i);
    });

    it('rejects when the user has no email', async () => {
        mockCurrentUser = { email: null, getIdToken: jest.fn() };
        await expect(reauthenticateWithPassword('pw')).rejects.toThrow(/no email/i);
        expect(mockReauthenticateWithCredential).not.toHaveBeenCalled();
    });

    it('re-authenticates with the account email and force-refreshes the token', async () => {
        const getIdToken = jest.fn().mockResolvedValue('fresh');
        mockCurrentUser = { email: 'me@example.com', getIdToken };
        mockReauthenticateWithCredential.mockResolvedValue({});

        await reauthenticateWithPassword('secret');

        expect(mockCredential).toHaveBeenCalledWith('me@example.com', 'secret');
        expect(mockReauthenticateWithCredential).toHaveBeenCalledWith(mockCurrentUser, { email: 'me@example.com', password: 'secret' });
        expect(getIdToken).toHaveBeenCalledWith(true);
    });

    it('propagates a wrong-password error and does not refresh the token', async () => {
        const getIdToken = jest.fn();
        mockCurrentUser = { email: 'me@example.com', getIdToken };
        mockReauthenticateWithCredential.mockRejectedValue(new FirebaseError('auth/invalid-credential', 'x'));

        await expect(reauthenticateWithPassword('bad')).rejects.toMatchObject({ code: 'auth/invalid-credential' });
        expect(getIdToken).not.toHaveBeenCalled();
    });
});

// ---- deleteAccount (real implementation, mocked network) ----

describe('deleteAccount request', () => {
    const { deleteAccount: realDeleteAccount } = jest.requireActual('@/lib/fetch-mutations');

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'warn').mockImplementation(() => {});
    });
    afterEach(() => jest.restoreAllMocks());

    it('sends DELETE to the user endpoint and resolves to {} on 204', async () => {
        mockAuthenticatedFetch.mockResolvedValue({ ok: true, status: 204 });
        await expect(realDeleteAccount()).resolves.toEqual({});
        expect(mockAuthenticatedFetch).toHaveBeenCalledWith(expect.stringMatching(/\/v1\/user\/$/), expect.objectContaining({ method: 'DELETE' }));
    });

    it('returns the backend detail message on failure', async () => {
        mockAuthenticatedFetch.mockResolvedValue({ ok: false, status: 502, json: async () => ({ detail: 'Try again later.' }) });
        await expect(realDeleteAccount()).resolves.toEqual({ error: 'Try again later.' });
    });

    it('falls back to a generic message for a non-JSON error body', async () => {
        mockAuthenticatedFetch.mockResolvedValue({ ok: false, status: 500, json: async () => { throw new Error('html'); } });
        const result = await realDeleteAccount();
        expect(result.error).toMatch(/unknown error/i);
    });

    it('returns a generic error when the network call throws', async () => {
        mockAuthenticatedFetch.mockRejectedValue(new Error('offline'));
        const result = await realDeleteAccount();
        expect(result.error).toMatch(/unknown error/i);
    });
});

// ---- DeleteAccountForm ----

describe('DeleteAccountForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        callOrder.length = 0;
        mockIsAnonymous = false;
        mockReauthenticate.mockImplementation(async () => { callOrder.push('reauth'); });
        mockCancelQueries.mockImplementation(async () => { callOrder.push('cancel'); });
        mockUnregisterPush.mockImplementation(async () => { callOrder.push('unregisterPush'); });
        mockDeleteAccount.mockImplementation(async () => { callOrder.push('delete'); return {}; });
        mockSignOut.mockImplementation(async () => { callOrder.push('signOut'); });
    });

    async function typePasswordAndSubmit(password = 'secret') {
        const user = userEvent.setup();
        await user.type(screen.getByLabelText(/^password/i), password);
        await user.click(screen.getByRole('button', { name: /delete my account/i }));
    }

    it('keeps the button disabled until the password is entered', async () => {
        render(<DeleteAccountForm />);
        const button = screen.getByRole('button', { name: /delete my account/i }) as HTMLButtonElement;
        expect(button.disabled).toBe(true);
        await userEvent.type(screen.getByLabelText(/^password/i), 'x');
        expect(button.disabled).toBe(false);
    });

    it('re-authenticates, cancels requests, unregisters push, deletes, then signs out and leaves', async () => {
        const close = jest.fn();
        render(<DeleteAccountForm handleCloseDialog={close} />);
        await typePasswordAndSubmit();

        await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/spaces'));
        expect(mockReauthenticate).toHaveBeenCalledWith('secret');
        expect(callOrder).toEqual(['reauth', 'cancel', 'unregisterPush', 'delete', 'signOut']);
        expect(mockClear).toHaveBeenCalled();
        expect(close).toHaveBeenCalled();
        expect(mockToast.success).toHaveBeenCalledWith(expect.stringMatching(/deleted/i));
    });

    it('offers "Forgot password?" that sends a reset email to the account address', async () => {
        mockSendPasswordReset.mockResolvedValue(undefined);
        render(<DeleteAccountForm />);
        await userEvent.click(screen.getByRole('button', { name: /forgot password/i }));

        await waitFor(() => expect(mockSendPasswordReset).toHaveBeenCalledWith('me@example.com'));
        expect(mockDeleteAccount).not.toHaveBeenCalled();
    });

    it('shows an error and deletes nothing on a wrong password', async () => {
        mockReauthenticate.mockRejectedValue(new FirebaseError('auth/invalid-credential', 'x'));
        render(<DeleteAccountForm />);
        await typePasswordAndSubmit('bad');

        expect(await screen.findByText('Incorrect password.')).toBeTruthy();
        expect(mockDeleteAccount).not.toHaveBeenCalled();
        expect(mockSignOut).not.toHaveBeenCalled();
        expect(mockReplace).not.toHaveBeenCalled();
    });

    it('shows a rate-limit message when re-authentication is throttled', async () => {
        mockReauthenticate.mockRejectedValue(new FirebaseError('auth/too-many-requests', 'x'));
        render(<DeleteAccountForm />);
        await typePasswordAndSubmit();
        expect(await screen.findByText(/too many attempts/i)).toBeTruthy();
        expect(mockDeleteAccount).not.toHaveBeenCalled();
    });

    it('shows the backend error and keeps the user signed in when deletion fails', async () => {
        mockDeleteAccount.mockResolvedValue({ error: 'We could not delete your account right now.' });
        const close = jest.fn();
        render(<DeleteAccountForm handleCloseDialog={close} />);
        await typePasswordAndSubmit();

        expect(await screen.findByText(/could not delete your account/i)).toBeTruthy();
        expect(mockSignOut).not.toHaveBeenCalled();
        expect(mockClear).not.toHaveBeenCalled();
        expect(close).not.toHaveBeenCalled();
        expect(mockReplace).not.toHaveBeenCalled();
    });

    describe('anonymous users', () => {
        beforeEach(() => {
            mockIsAnonymous = true;
        });

        it('require typing the confirmation word and skip re-authentication', async () => {
            render(<DeleteAccountForm />);
            const button = screen.getByRole('button', { name: /delete my account/i }) as HTMLButtonElement;
            const user = userEvent.setup();

            expect(button.disabled).toBe(true);
            await user.type(screen.getByLabelText(/confirmation/i), 'delet');
            expect(button.disabled).toBe(true);
            await user.type(screen.getByLabelText(/confirmation/i), 'e');
            expect(button.disabled).toBe(true); // case-sensitive: "delete" is not "DELETE"

            await user.clear(screen.getByLabelText(/confirmation/i));
            await user.type(screen.getByLabelText(/confirmation/i), DELETE_CONFIRMATION_WORD);
            expect(button.disabled).toBe(false);

            await user.click(button);
            await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/spaces'));
            expect(mockReauthenticate).not.toHaveBeenCalled();
            expect(callOrder).toEqual(['cancel', 'unregisterPush', 'delete', 'signOut']);
        });
    });
});
