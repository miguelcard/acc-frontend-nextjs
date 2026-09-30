/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FirebaseError } from 'firebase/app';
import SignUp from '@/app/(auth)/signup/page';

const mockPush = jest.fn();
let mockToken: string | null = 'tok-123';
let mockIsAnonymous: boolean | null = true;

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
    useSearchParams: () => ({ get: (key: string) => (key === 'invite' ? mockToken : null) }),
}));

const mockLinkWithEmail = jest.fn();
const mockSignInWithEmail = jest.fn();
jest.mock('@/lib/auth/auth-context', () => ({
    useAuth: () => ({
        linkWithEmail: mockLinkWithEmail,
        signInWithEmail: mockSignInWithEmail,
        isAnonymous: mockIsAnonymous,
    }),
}));

const mockGetInviteDetails = jest.fn();
const mockAcceptInvite = jest.fn();
jest.mock('@/lib/fetch-mutations', () => ({
    getInviteDetails: (...args: unknown[]) => mockGetInviteDetails(...args),
    acceptInvite: (...args: unknown[]) => mockAcceptInvite(...args),
}));

async function fillAndSubmit(buttonName: RegExp) {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/email/i), 'me@example.com');
    await user.type(screen.getByLabelText(/password/i), 'secret123');
    await user.click(screen.getByRole('button', { name: buttonName }));
}

describe('SignUp page (invite flow)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockToken = 'tok-123';
        mockIsAnonymous = true;
        mockGetInviteDetails.mockResolvedValue({ space_name: 'Gym Crew', masked_email: 'm***@example.com' });
        mockAcceptInvite.mockResolvedValue({});
    });

    it('shows an error when the invite token is missing', async () => {
        mockToken = null;
        render(<SignUp />);
        expect(await screen.findByText(/no invite token found/i)).toBeTruthy();
        expect(mockGetInviteDetails).not.toHaveBeenCalled();
    });

    it('shows the backend error for an invalid invite', async () => {
        mockGetInviteDetails.mockResolvedValue({ error: 'Invite expired' });
        render(<SignUp />);
        expect(await screen.findByText('Invite expired')).toBeTruthy();
    });

    it('links the account, accepts the invite and redirects on success', async () => {
        mockLinkWithEmail.mockResolvedValue({});
        render(<SignUp />);
        await screen.findByText('Gym Crew');
        await fillAndSubmit(/create account/i);

        await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/spaces'));
        expect(mockLinkWithEmail).toHaveBeenCalledWith('me@example.com', 'secret123');
        expect(mockAcceptInvite).toHaveBeenCalledWith('tok-123');
        expect(mockSignInWithEmail).not.toHaveBeenCalled();
    });

    it('switches to sign-in mode when the email is already in use, then signs in', async () => {
        mockLinkWithEmail.mockRejectedValue(new FirebaseError('auth/email-already-in-use', 'exists'));
        mockSignInWithEmail.mockResolvedValue({});
        render(<SignUp />);
        await screen.findByText('Gym Crew');
        await fillAndSubmit(/create account/i);

        expect(await screen.findByText(/already exists/i)).toBeTruthy();
        expect(screen.getByRole('button', { name: /sign in & join space/i })).toBeTruthy();
        expect(mockAcceptInvite).not.toHaveBeenCalled();

        await userEvent.setup().click(screen.getByRole('button', { name: /sign in & join space/i }));

        await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/spaces'));
        expect(mockSignInWithEmail).toHaveBeenCalledWith('me@example.com', 'secret123');
        expect(mockAcceptInvite).toHaveBeenCalledWith('tok-123');
    });

    it('shows a password error and does not accept the invite', async () => {
        mockLinkWithEmail.mockRejectedValue(new FirebaseError('auth/weak-password', 'weak'));
        render(<SignUp />);
        await screen.findByText('Gym Crew');
        await fillAndSubmit(/create account/i);

        expect(await screen.findByText(/at least 6 characters/i)).toBeTruthy();
        expect(mockAcceptInvite).not.toHaveBeenCalled();
        expect(mockPush).not.toHaveBeenCalled();
    });

    it('shows the backend error when accepting the invite fails', async () => {
        mockLinkWithEmail.mockResolvedValue({});
        mockAcceptInvite.mockResolvedValue({ error: 'Email does not match invite' });
        render(<SignUp />);
        await screen.findByText('Gym Crew');
        await fillAndSubmit(/create account/i);

        expect(await screen.findByText('Email does not match invite')).toBeTruthy();
        expect(mockPush).not.toHaveBeenCalled();
    });

    it('lets an already-registered user accept the invite without linking or signing in', async () => {
        mockIsAnonymous = false;
        render(<SignUp />);
        await screen.findByText('Gym Crew');

        expect(screen.queryByLabelText(/password/i)).toBeNull();
        await userEvent.setup().click(screen.getByRole('button', { name: /join space/i }));

        await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/spaces'));
        expect(mockAcceptInvite).toHaveBeenCalledWith('tok-123');
        expect(mockLinkWithEmail).not.toHaveBeenCalled();
        expect(mockSignInWithEmail).not.toHaveBeenCalled();
    });

    it('shows the backend error when a registered user has a different email than the invite', async () => {
        mockIsAnonymous = false;
        mockAcceptInvite.mockResolvedValue({ error: 'This invite is for a different email address.' });
        render(<SignUp />);
        await screen.findByText('Gym Crew');
        await userEvent.setup().click(screen.getByRole('button', { name: /join space/i }));

        expect(await screen.findByText(/different email address/i)).toBeTruthy();
        expect(mockPush).not.toHaveBeenCalled();
    });
});
