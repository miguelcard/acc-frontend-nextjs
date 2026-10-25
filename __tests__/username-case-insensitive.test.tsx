/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InviteMembers } from '@/components/space/MoreOptionsMenu/invite-members';
import { UsernameSetupGate } from '@/components/auth/UsernameSetupGate/username-setup-gate';
import { getUsernameEmailSuggestions, checkUsernameOrEmailExist } from '@/lib/fetch-mutations';
import { getUser } from '@/lib/fetch-queries';

jest.mock('@/lib/fetch-mutations', () => ({
    getUsernameEmailSuggestions: jest.fn(),
    checkUsernameOrEmailExist: jest.fn(),
}));

jest.mock('@/lib/fetch-queries', () => ({
    getUser: jest.fn(),
}));

const mockCreateSpaceRole = jest.fn();
const mockPatchUser = jest.fn();
jest.mock('@/lib/hooks/mutations', () => ({
    useCreateSpaceRole: () => ({ mutateAsync: mockCreateSpaceRole }),
    usePatchUser: () => ({ mutateAsync: mockPatchUser }),
}));

jest.mock('@/lib/auth/auth-context', () => ({
    useAuth: () => ({ user: { uid: 'firebase-uid-1' } }),
}));

const mockSuggestions = getUsernameEmailSuggestions as jest.Mock;
const mockCheckExists = checkUsernameOrEmailExist as jest.Mock;
const mockGetUser = getUser as jest.Mock;

beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
});

// ─── Invite members box ──────────────────────────────────────────────────────

describe('InviteMembers', () => {
    it('suggests a username regardless of the case typed', async () => {
        mockSuggestions.mockResolvedValue({ results: [{ id: 1, username: 'miggy' }] });
        const user = userEvent.setup();
        render(<InviteMembers spaceId={1} />);

        await user.type(screen.getByRole('combobox'), 'MIGGY');

        expect(await screen.findByText('miggy')).toBeTruthy();
    });

    it('also suggests when the stored username still has uppercase letters', async () => {
        mockSuggestions.mockResolvedValue({ results: [{ id: 1, username: 'Miggy' }] });
        const user = userEvent.setup();
        render(<InviteMembers spaceId={1} />);

        await user.type(screen.getByRole('combobox'), 'miggy');

        expect(await screen.findByText('Miggy')).toBeTruthy();
    });

    it('does not suggest usernames that do not contain what was typed', async () => {
        mockSuggestions.mockResolvedValue({
            results: [{ id: 1, username: 'miggy' }, { id: 2, username: 'zzz' }],
        });
        const user = userEvent.setup();
        render(<InviteMembers spaceId={1} />);

        await user.type(screen.getByRole('combobox'), 'Mig');

        await screen.findByText('miggy');
        expect(screen.queryByText('zzz')).toBeNull();
    });

    it('sends the trimmed text to the suggestions endpoint', async () => {
        mockSuggestions.mockResolvedValue({ results: [] });
        const user = userEvent.setup();
        render(<InviteMembers spaceId={1} />);

        await user.type(screen.getByRole('combobox'), '  Mig ');

        await waitFor(() => expect(mockSuggestions).toHaveBeenCalled());
        mockSuggestions.mock.calls.forEach(([searched]) => expect(searched).toBe(searched.trim()));
    });

    it('disables auto-capitalization and auto-correct on the input', () => {
        render(<InviteMembers spaceId={1} />);
        const input = screen.getByRole('combobox');
        expect(input.getAttribute('autocapitalize')).toBe('none');
        expect(input.getAttribute('autocorrect')).toBe('off');
    });

    it('submits the chosen suggestion to add the member', async () => {
        mockSuggestions.mockResolvedValue({ results: [{ id: 1, username: 'miggy' }] });
        mockCreateSpaceRole.mockResolvedValue({ id: 99 });
        const handleToastOpen = jest.fn();
        const user = userEvent.setup();
        render(<InviteMembers spaceId={7} handleToastOpen={handleToastOpen} />);

        await user.type(screen.getByRole('combobox'), 'MIG');
        await user.click(await screen.findByText('miggy'));
        await user.click(screen.getByRole('button', { name: /invite/i }));

        await waitFor(() => expect(mockCreateSpaceRole).toHaveBeenCalled());
        expect(mockCreateSpaceRole.mock.calls[0][0].formData).toMatchObject({
            username_email: 'miggy',
            space: 7,
            role: 'member',
        });
        await waitFor(() => expect(handleToastOpen).toHaveBeenCalledWith('Member added to the space!'));
    });

    it('lets the backend decide for free-typed values and shows its error', async () => {
        mockSuggestions.mockResolvedValue({ results: [] });
        mockCreateSpaceRole.mockResolvedValue({ error: 'No user found with username or email "Nobody".' });
        const user = userEvent.setup();
        render(<InviteMembers spaceId={7} />);

        await user.type(screen.getByRole('combobox'), 'Nobody');
        await user.click(screen.getByRole('button', { name: /invite/i }));

        expect(await screen.findByText(/No user found/)).toBeTruthy();
        expect(mockCreateSpaceRole.mock.calls[0][0].formData.username_email).toBe('Nobody');
    });
});

// ─── Username setup gate (after anonymous sign-in) ───────────────────────────

describe('UsernameSetupGate', () => {
    async function renderGateNeedingSetup() {
        mockGetUser.mockResolvedValue({ username: 'fb_abcdef' });
        mockCheckExists.mockResolvedValue({ username_taken: false });
        mockPatchUser.mockResolvedValue({});
        render(
            <UsernameSetupGate>
                <div>app content</div>
            </UsernameSetupGate>,
        );
        return (await screen.findByPlaceholderText('username')) as HTMLInputElement;
    }

    it('shows the app straight away for users that already chose a username', async () => {
        mockGetUser.mockResolvedValue({ username: 'miggy' });
        render(
            <UsernameSetupGate>
                <div>app content</div>
            </UsernameSetupGate>,
        );
        expect(await screen.findByText('app content')).toBeTruthy();
        expect(screen.queryByPlaceholderText('username')).toBeNull();
    });

    it('lowercases the input and disables auto-capitalization', async () => {
        const user = userEvent.setup();
        const input = await renderGateNeedingSetup();

        await user.type(input, 'MiGgY');

        await waitFor(() => expect(input.value).toBe('miggy'));
        expect(input.getAttribute('autocapitalize')).toBe('none');
    });

    it('lowercases pasted text too and tells the user usernames are lowercase', async () => {
        const user = userEvent.setup();
        const input = await renderGateNeedingSetup();

        await user.click(input);
        await user.paste('PASTED_Name');

        await waitFor(() => expect(input.value).toBe('pasted_name'));
        expect(screen.getByText(/usernames are lowercase/i)).toBeTruthy();
    });

    it('checks availability and saves the lowercase username, then shows the app', async () => {
        const user = userEvent.setup();
        const input = await renderGateNeedingSetup();

        await user.type(input, 'MiGgY');
        const button = screen.getByRole('button', { name: /continue/i });
        await waitFor(() => expect((button as HTMLButtonElement).disabled).toBe(false));
        await user.click(button);

        await waitFor(() => expect(mockPatchUser).toHaveBeenCalledWith({ username: 'miggy' }));
        expect(mockCheckExists).toHaveBeenCalledWith('miggy', null);
        expect(await screen.findByText('app content')).toBeTruthy();
        expect(localStorage.getItem('username_configured_firebase-uid-1')).toBe('true');
    });

    it('does not save a username that is already taken', async () => {
        const user = userEvent.setup();
        const input = await renderGateNeedingSetup();
        mockCheckExists.mockResolvedValue({ username_taken: true });

        await user.type(input, 'Miggy');
        await user.tab();

        expect(await screen.findByText('Username is already taken')).toBeTruthy();
        expect((screen.getByRole('button', { name: /continue/i }) as HTMLButtonElement).disabled).toBe(true);
        expect(mockPatchUser).not.toHaveBeenCalled();
    });

    it('rejects names starting with fb_ whatever the case typed', async () => {
        const user = userEvent.setup();
        const input = await renderGateNeedingSetup();

        await user.type(input, 'FB_sneaky');
        await user.tab();

        expect(await screen.findByText('Username cannot start with "fb_"')).toBeTruthy();
    });

    it('shows the backend error and keeps the form when saving fails', async () => {
        const user = userEvent.setup();
        const input = await renderGateNeedingSetup();
        mockPatchUser.mockResolvedValue({ error: 'Something went wrong' });

        await user.type(input, 'miggy');
        const button = screen.getByRole('button', { name: /continue/i });
        await waitFor(() => expect((button as HTMLButtonElement).disabled).toBe(false));
        await user.click(button);

        expect(await screen.findByText('Something went wrong')).toBeTruthy();
        expect(screen.queryByText('app content')).toBeNull();
    });
});
