/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react';

const mockUseAuth = jest.fn();
const mockInit = jest.fn();

jest.mock('@/lib/auth/auth-context', () => ({ useAuth: () => mockUseAuth() }));
jest.mock('@/lib/push-notifications', () => ({ initPushRegistration: () => mockInit() }));

import { usePushRegistration } from '@/lib/hooks/usePushRegistration';

let cleanup: jest.Mock;

beforeEach(() => {
    jest.clearAllMocks();
    cleanup = jest.fn();
    mockInit.mockResolvedValue(cleanup);
});

describe('usePushRegistration', () => {
    it('registers for a signed-in, non-anonymous user', async () => {
        mockUseAuth.mockReturnValue({ user: { uid: 'u1' }, isAnonymous: false });
        renderHook(() => usePushRegistration());
        expect(mockInit).toHaveBeenCalledTimes(1);
    });

    it('registers anonymous users too', () => {
        mockUseAuth.mockReturnValue({ user: { uid: 'anon' }, isAnonymous: true });
        renderHook(() => usePushRegistration());
        expect(mockInit).toHaveBeenCalledTimes(1);
    });

    it('does not register again when an anonymous user upgrades (same uid)', () => {
        mockUseAuth.mockReturnValue({ user: { uid: 'u1' }, isAnonymous: true });
        const { rerender } = renderHook(() => usePushRegistration());
        mockUseAuth.mockReturnValue({ user: { uid: 'u1' }, isAnonymous: false });
        rerender();
        expect(mockInit).toHaveBeenCalledTimes(1);
    });

    it('does not register when nobody is signed in', () => {
        mockUseAuth.mockReturnValue({ user: null, isAnonymous: null });
        renderHook(() => usePushRegistration());
        expect(mockInit).not.toHaveBeenCalled();
    });

    it('does not register again on re-render for the same user', () => {
        mockUseAuth.mockReturnValue({ user: { uid: 'u1' }, isAnonymous: false });
        const { rerender } = renderHook(() => usePushRegistration());
        rerender();
        rerender();
        expect(mockInit).toHaveBeenCalledTimes(1);
    });

    it('removes listeners on unmount', async () => {
        mockUseAuth.mockReturnValue({ user: { uid: 'u1' }, isAnonymous: false });
        const { unmount } = renderHook(() => usePushRegistration());
        await Promise.resolve(); // let initPushRegistration() resolve and hand back its cleanup
        unmount();
        expect(cleanup).toHaveBeenCalledTimes(1);
    });

    it('cleans up immediately if unmounted before setup finished', async () => {
        mockUseAuth.mockReturnValue({ user: { uid: 'u1' }, isAnonymous: false });
        const { unmount } = renderHook(() => usePushRegistration());
        unmount(); // before the init promise resolved
        await Promise.resolve();
        await Promise.resolve();
        expect(cleanup).toHaveBeenCalledTimes(1);
    });

    it('registers again when a different user signs in', () => {
        mockUseAuth.mockReturnValue({ user: { uid: 'u1' }, isAnonymous: false });
        const { rerender } = renderHook(() => usePushRegistration());
        mockUseAuth.mockReturnValue({ user: { uid: 'u2' }, isAnonymous: false });
        rerender();
        expect(mockInit).toHaveBeenCalledTimes(2);
    });
});
