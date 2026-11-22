/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FirebaseError } from 'firebase/app';

const mockSendPasswordResetEmail = jest.fn();
jest.mock('firebase/auth', () => ({
    signInAnonymously: jest.fn(),
    onAuthStateChanged: jest.fn(),
    signOut: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    linkWithCredential: jest.fn(),
    EmailAuthProvider: { credential: jest.fn() },
    sendPasswordResetEmail: (...args: unknown[]) => mockSendPasswordResetEmail(...args),
}));
jest.mock('@/lib/firebase', () => ({ auth: { name: 'fake-auth' } }));

import { sendPasswordReset } from '@/lib/auth/firebase-auth';

describe('sendPasswordReset (firebase-auth)', () => {
    beforeEach(() => jest.clearAllMocks());

    it('calls Firebase with the trimmed email', async () => {
        mockSendPasswordResetEmail.mockResolvedValue(undefined);
        await sendPasswordReset('  me@example.com ');
        expect(mockSendPasswordResetEmail).toHaveBeenCalledWith({ name: 'fake-auth' }, 'me@example.com');
    });

    it('resolves silently when no account exists for the email', async () => {
        mockSendPasswordResetEmail.mockRejectedValue(new FirebaseError('auth/user-not-found', 'nope'));
        await expect(sendPasswordReset('ghost@example.com')).resolves.toBeUndefined();
    });

    it('rethrows other Firebase errors', async () => {
        mockSendPasswordResetEmail.mockRejectedValue(new FirebaseError('auth/invalid-email', 'bad'));
        await expect(sendPasswordReset('not-an-email')).rejects.toMatchObject({ code: 'auth/invalid-email' });
    });
});

// ---- ForgotPasswordButton ----

const mockToastSuccess = jest.fn();
const mockToastError = jest.fn();
jest.mock('react-hot-toast', () => ({
    __esModule: true,
    default: {
        success: (...args: unknown[]) => mockToastSuccess(...args),
        error: (...args: unknown[]) => mockToastError(...args),
    },
}));

const mockContextSendPasswordReset = jest.fn();
jest.mock('@/lib/auth/auth-context', () => ({
    useAuth: () => ({ sendPasswordReset: mockContextSendPasswordReset }),
}));

import { ForgotPasswordButton } from '@/components/auth/ForgotPasswordButton/forgot-password-button';

describe('ForgotPasswordButton', () => {
    beforeEach(() => jest.clearAllMocks());

    it('asks for an email first when the field is empty', async () => {
        render(<ForgotPasswordButton email="  " />);
        await userEvent.click(screen.getByRole('button', { name: /forgot password/i }));
        expect(mockContextSendPasswordReset).not.toHaveBeenCalled();
        expect(mockToastError).toHaveBeenCalledWith(expect.stringMatching(/enter your email/i));
    });

    it('sends the reset email and shows a generic success message', async () => {
        mockContextSendPasswordReset.mockResolvedValue(undefined);
        render(<ForgotPasswordButton email="me@example.com" />);
        await userEvent.click(screen.getByRole('button', { name: /forgot password/i }));
        await waitFor(() => expect(mockToastSuccess).toHaveBeenCalled());
        expect(mockContextSendPasswordReset).toHaveBeenCalledWith('me@example.com');
        expect(mockToastSuccess.mock.calls[0][0]).toMatch(/if an account exists/i);
    });

    it.each([
        ['auth/invalid-email', /valid email/i],
        ['auth/too-many-requests', /too many attempts/i],
        ['auth/network-request-failed', /could not send/i],
    ])('shows a friendly message for %s', async (code, message) => {
        mockContextSendPasswordReset.mockRejectedValue(new FirebaseError(code, 'x'));
        render(<ForgotPasswordButton email="me@example.com" />);
        await userEvent.click(screen.getByRole('button', { name: /forgot password/i }));
        await waitFor(() => expect(mockToastError).toHaveBeenCalledWith(expect.stringMatching(message)));
        expect(mockToastSuccess).not.toHaveBeenCalled();
    });
});
