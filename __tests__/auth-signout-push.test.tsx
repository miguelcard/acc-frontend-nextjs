/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockUnregisterPush = jest.fn();
const mockSignOutUser = jest.fn();
const fakeUser = { uid: 'u1', isAnonymous: false };

jest.mock('@/lib/push-notifications', () => ({ unregisterPush: () => mockUnregisterPush() }));
jest.mock('@/lib/auth/firebase-auth', () => ({
    initAnonymousAuth: jest.fn(),
    onAuthStateChanged: (cb: (u: unknown) => void) => {
        cb(fakeUser);
        return () => {};
    },
    getIdToken: jest.fn(),
    signOutUser: () => mockSignOutUser(),
    linkWithEmail: jest.fn(),
    signInWithEmail: jest.fn(),
}));

import { AuthProvider, useAuth } from '@/lib/auth/auth-context';

function SignOutButton() {
    const { signOut } = useAuth();
    return <button onClick={() => signOut()}>sign out</button>;
}

function renderProvider() {
    return render(
        <AuthProvider>
            <SignOutButton />
        </AuthProvider>,
    );
}

beforeEach(() => {
    jest.clearAllMocks();
    mockUnregisterPush.mockResolvedValue(undefined);
    mockSignOutUser.mockResolvedValue(undefined);
});

describe('AuthProvider.signOut and push', () => {
    it('removes the push token before signing out (while still authenticated)', async () => {
        renderProvider();
        await userEvent.click(await screen.findByText('sign out'));

        await waitFor(() => expect(mockSignOutUser).toHaveBeenCalled());
        expect(mockUnregisterPush.mock.invocationCallOrder[0]).toBeLessThan(
            mockSignOutUser.mock.invocationCallOrder[0],
        );
    });
});
