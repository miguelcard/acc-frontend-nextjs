/**
 * @jest-environment jsdom
 */
import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FirebaseError } from 'firebase/app';

const mockToast = Object.assign(jest.fn(), { success: jest.fn(), error: jest.fn() });
jest.mock('react-hot-toast', () => ({ __esModule: true, default: mockToast }));

let mockAuthState: {
    isAnonymous: boolean | null;
    isEmailVerified: boolean | null;
    user: { email: string } | null;
};
const mockSendVerificationEmail = jest.fn();
const mockReloadUser = jest.fn();
jest.mock('@/lib/auth/auth-context', () => ({
    useAuth: () => ({
        ...mockAuthState,
        sendVerificationEmail: mockSendVerificationEmail,
        reloadUser: mockReloadUser,
    }),
}));

import VerifyEmailNotice, { RESEND_COOLDOWN_SECONDS } from '@/components/profile/VerifyEmailNotice/verify-email-notice';

describe('VerifyEmailNotice', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockAuthState = { isAnonymous: false, isEmailVerified: false, user: { email: 'me@example.com' } };
        mockSendVerificationEmail.mockResolvedValue(undefined);
        mockReloadUser.mockResolvedValue(false);
    });

    it.each([
        ['anonymous users', { isAnonymous: true, isEmailVerified: false }],
        ['verified users', { isAnonymous: false, isEmailVerified: true }],
        ['unknown auth state', { isAnonymous: null, isEmailVerified: null }],
    ])('renders nothing for %s', (_label, state) => {
        mockAuthState = { ...mockAuthState, ...state };
        const { container } = render(<VerifyEmailNotice />);
        expect(container.firstChild).toBeNull();
    });

    it('shows the email that needs verification', () => {
        render(<VerifyEmailNotice />);
        expect(screen.getByText('me@example.com')).toBeTruthy();
    });

    it('sends the email, confirms, and starts the resend cooldown', async () => {
        render(<VerifyEmailNotice />);
        await userEvent.click(screen.getByRole('button', { name: /send email/i }));

        await waitFor(() => expect(mockToast.success).toHaveBeenCalledWith(expect.stringMatching(/verification email sent/i)));
        expect(mockSendVerificationEmail).toHaveBeenCalledTimes(1);
        const resend = screen.getByRole('button', { name: new RegExp(`resend \\(${RESEND_COOLDOWN_SECONDS}s\\)`, 'i') });
        expect((resend as HTMLButtonElement).disabled).toBe(true);
    });

    it('counts the cooldown down and re-enables the button', async () => {
        jest.useFakeTimers();
        try {
            const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
            render(<VerifyEmailNotice />);
            await user.click(screen.getByRole('button', { name: /send email/i }));
            await screen.findByRole('button', { name: /resend \(/i });

            for (let i = 0; i < RESEND_COOLDOWN_SECONDS; i++) {
                await act(async () => { jest.advanceTimersByTime(1000); });
            }
            const again = screen.getByRole('button', { name: /send email/i });
            expect((again as HTMLButtonElement).disabled).toBe(false);
        } finally {
            jest.useRealTimers();
        }
    });

    it('shows a rate-limit message and also starts the cooldown', async () => {
        mockSendVerificationEmail.mockRejectedValue(new FirebaseError('auth/too-many-requests', 'x'));
        render(<VerifyEmailNotice />);
        await userEvent.click(screen.getByRole('button', { name: /send email/i }));

        await waitFor(() => expect(mockToast.error).toHaveBeenCalledWith(expect.stringMatching(/too many attempts/i)));
        expect(screen.getByRole('button', { name: /resend \(/i })).toBeTruthy();
    });

    it('shows a generic error for other failures without a cooldown', async () => {
        mockSendVerificationEmail.mockRejectedValue(new Error('offline'));
        render(<VerifyEmailNotice />);
        await userEvent.click(screen.getByRole('button', { name: /send email/i }));

        await waitFor(() => expect(mockToast.error).toHaveBeenCalledWith(expect.stringMatching(/could not send/i)));
        expect(screen.getByRole('button', { name: /send email/i })).toBeTruthy();
    });

    it('tells the user when the email is not verified yet', async () => {
        render(<VerifyEmailNotice />);
        await userEvent.click(screen.getByRole('button', { name: /i've verified/i }));
        await waitFor(() => expect(mockToast).toHaveBeenCalledWith(expect.stringMatching(/not verified yet/i)));
        expect(mockToast.success).not.toHaveBeenCalled();
    });

    it('thanks the user when the reload shows the email is verified', async () => {
        mockReloadUser.mockResolvedValue(true);
        render(<VerifyEmailNotice />);
        await userEvent.click(screen.getByRole('button', { name: /i've verified/i }));
        await waitFor(() => expect(mockToast.success).toHaveBeenCalledWith(expect.stringMatching(/email verified/i)));
    });

    it('shows an error when the status check fails', async () => {
        mockReloadUser.mockRejectedValue(new Error('network'));
        render(<VerifyEmailNotice />);
        await userEvent.click(screen.getByRole('button', { name: /i've verified/i }));
        await waitFor(() => expect(mockToast.error).toHaveBeenCalledWith(expect.stringMatching(/could not check/i)));
    });

    it('silently re-checks when the app becomes visible again', async () => {
        render(<VerifyEmailNotice />);
        Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
        document.dispatchEvent(new Event('visibilitychange'));
        await waitFor(() => expect(mockReloadUser).toHaveBeenCalledTimes(1));
        expect(mockToast).not.toHaveBeenCalled();
    });

    it('does not listen for visibility changes when the notice is hidden', () => {
        mockAuthState = { ...mockAuthState, isEmailVerified: true };
        render(<VerifyEmailNotice />);
        document.dispatchEvent(new Event('visibilitychange'));
        expect(mockReloadUser).not.toHaveBeenCalled();
    });
});
