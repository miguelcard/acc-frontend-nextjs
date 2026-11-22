/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FirebaseError } from 'firebase/app';

const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush, replace: mockReplace }) }));

const mockToast = Object.assign(jest.fn(), { success: jest.fn(), error: jest.fn() });
jest.mock('react-hot-toast', () => ({ __esModule: true, default: mockToast }));

const mockClear = jest.fn();
const mockInvalidateQueries = jest.fn();
jest.mock('@tanstack/react-query', () => ({
    useQueryClient: () => ({ clear: mockClear, invalidateQueries: mockInvalidateQueries }),
}));

let mockIsAnonymous: boolean | null = true;
const mockLinkWithEmail = jest.fn();
const mockSignInWithEmail = jest.fn();
const mockSendVerificationEmail = jest.fn();
const mockRefreshUser = jest.fn();
const mockSendPasswordReset = jest.fn();
jest.mock('@/lib/auth/auth-context', () => ({
    useAuth: () => ({
        isAnonymous: mockIsAnonymous,
        linkWithEmail: mockLinkWithEmail,
        signInWithEmail: mockSignInWithEmail,
        sendVerificationEmail: mockSendVerificationEmail,
        refreshUser: mockRefreshUser,
        sendPasswordReset: mockSendPasswordReset,
    }),
}));

import { AccountAuthForm } from '@/components/profile/ChangeUserFields/account-auth-form';
import Login from '@/app/(auth)/login/page';

async function fill(email = 'me@example.com', password = 'secret123') {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/email/i), email);
    await user.type(screen.getByLabelText(/^password/i), password);
    return user;
}

beforeEach(() => {
    jest.clearAllMocks();
    mockIsAnonymous = true;
    mockLinkWithEmail.mockResolvedValue({});
    mockSignInWithEmail.mockResolvedValue({});
    mockSendVerificationEmail.mockResolvedValue(undefined);
    mockInvalidateQueries.mockResolvedValue(undefined);
});

describe('AccountAuthForm: save account', () => {
    it('links the account, refreshes the user, sends the verification email and closes', async () => {
        const close = jest.fn();
        render(<AccountAuthForm handleCloseDialog={close} />);
        const user = await fill('  me@example.com ');
        await user.click(screen.getByRole('button', { name: /save my account/i }));

        await waitFor(() => expect(close).toHaveBeenCalled());
        expect(mockLinkWithEmail).toHaveBeenCalledWith('me@example.com', 'secret123');
        expect(mockRefreshUser).toHaveBeenCalled();
        expect(mockInvalidateQueries).toHaveBeenCalled();
        expect(mockSendVerificationEmail).toHaveBeenCalledTimes(1);
        expect(mockToast.success).toHaveBeenCalledWith(expect.stringMatching(/check your inbox/i));
    });

    it('still succeeds when the verification email cannot be sent', async () => {
        mockSendVerificationEmail.mockRejectedValue(new Error('smtp down'));
        const close = jest.fn();
        render(<AccountAuthForm handleCloseDialog={close} />);
        const user = await fill();
        await user.click(screen.getByRole('button', { name: /save my account/i }));

        await waitFor(() => expect(close).toHaveBeenCalled());
        expect(mockToast.success).toHaveBeenCalledWith(expect.stringMatching(/verify your email from your profile/i));
        expect(mockToast.error).not.toHaveBeenCalled();
    });

    it('switches to sign-in with a notice when the email is already registered', async () => {
        mockLinkWithEmail.mockRejectedValue(new FirebaseError('auth/email-already-in-use', 'x'));
        const close = jest.fn();
        render(<AccountAuthForm handleCloseDialog={close} />);
        const user = await fill();
        await user.click(screen.getByRole('button', { name: /save my account/i }));

        expect(await screen.findByText(/already exists/i)).toBeTruthy();
        expect(screen.getByRole('button', { name: /^sign in$/i })).toBeTruthy();
        expect((screen.getByLabelText(/email/i) as HTMLInputElement).value).toBe('me@example.com');
        expect(close).not.toHaveBeenCalled();
        expect(mockSendVerificationEmail).not.toHaveBeenCalled();
    });

    it.each([
        ['auth/weak-password', /at least 6 characters/i],
        ['auth/invalid-email', /valid email/i],
        ['auth/something-else', /something went wrong/i],
    ])('shows an inline error for %s and keeps the form open', async (code, message) => {
        mockLinkWithEmail.mockRejectedValue(new FirebaseError(code, 'x'));
        const close = jest.fn();
        render(<AccountAuthForm handleCloseDialog={close} />);
        const user = await fill();
        await user.click(screen.getByRole('button', { name: /save my account/i }));

        expect(await screen.findByText(message)).toBeTruthy();
        expect(close).not.toHaveBeenCalled();
        expect(mockRefreshUser).not.toHaveBeenCalled();
    });
});

describe('AccountAuthForm: sign in', () => {
    it('signs in, clears cached data, closes and goes to /spaces', async () => {
        const close = jest.fn();
        render(<AccountAuthForm handleCloseDialog={close} />);
        await userEvent.click(screen.getByRole('button', { name: /sign in instead/i }));
        const user = await fill();
        await user.click(screen.getByRole('button', { name: /^sign in$/i }));

        await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/spaces'));
        expect(mockSignInWithEmail).toHaveBeenCalledWith('me@example.com', 'secret123');
        expect(mockClear).toHaveBeenCalled();
        expect(close).toHaveBeenCalled();
    });

    it('shows an error and does not navigate on wrong credentials', async () => {
        mockSignInWithEmail.mockRejectedValue(new FirebaseError('auth/invalid-credential', 'x'));
        render(<AccountAuthForm />);
        await userEvent.click(screen.getByRole('button', { name: /sign in instead/i }));
        const user = await fill();
        await user.click(screen.getByRole('button', { name: /^sign in$/i }));

        expect(await screen.findByText(/incorrect email or password/i)).toBeTruthy();
        expect(mockClear).not.toHaveBeenCalled();
        expect(mockPush).not.toHaveBeenCalled();
    });

    it('offers "Forgot password?" in sign-in mode only', async () => {
        render(<AccountAuthForm />);
        expect(screen.queryByRole('button', { name: /forgot password/i })).toBeNull();
        await userEvent.click(screen.getByRole('button', { name: /sign in instead/i }));
        expect(screen.getByRole('button', { name: /forgot password/i })).toBeTruthy();
    });

    it('can switch back to saving the account', async () => {
        render(<AccountAuthForm />);
        await userEvent.click(screen.getByRole('button', { name: /sign in instead/i }));
        await userEvent.click(screen.getByRole('button', { name: /save my account instead/i }));
        expect(screen.getByRole('button', { name: /save my account$/i })).toBeTruthy();
    });
});

describe('Login page', () => {
    it('shows the sign-in form and a continue-as-guest link for anonymous users', () => {
        render(<Login />);
        expect(screen.getByRole('heading', { name: /log in/i })).toBeTruthy();
        expect(screen.getByRole('button', { name: /^sign in$/i })).toBeTruthy();
        expect(screen.getByRole('link', { name: /continue as guest/i }).getAttribute('href')).toBe('/spaces');
        expect(mockReplace).not.toHaveBeenCalled();
    });

    it('signs in and replaces the route with /spaces', async () => {
        render(<Login />);
        const user = await fill();
        await user.click(screen.getByRole('button', { name: /^sign in$/i }));

        await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/spaces'));
        expect(mockClear).toHaveBeenCalled();
    });

    it('shows an error for wrong credentials and stays on the page', async () => {
        mockSignInWithEmail.mockRejectedValue(new FirebaseError('auth/wrong-password', 'x'));
        render(<Login />);
        const user = await fill();
        await user.click(screen.getByRole('button', { name: /^sign in$/i }));

        expect(await screen.findByText(/incorrect email or password/i)).toBeTruthy();
        expect(mockReplace).not.toHaveBeenCalled();
    });

    it('redirects away when the user is already registered', async () => {
        mockIsAnonymous = false;
        const { container } = render(<Login />);
        await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/spaces'));
        expect(container.firstChild).toBeNull();
    });
});


describe('PasswordField', () => {
    it('toggles password visibility with the eye button', async () => {
        render(<AccountAuthForm />);
        const input = screen.getByLabelText(/^password/i) as HTMLInputElement;
        expect(input.type).toBe('password');
        await userEvent.click(screen.getByRole('button', { name: /show password/i }));
        expect(input.type).toBe('text');
        await userEvent.click(screen.getByRole('button', { name: /hide password/i }));
        expect(input.type).toBe('password');
    });
});
