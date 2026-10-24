'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { initPushRegistration } from '@/lib/push-notifications';

/**
 * Registers this device for push once a user (anonymous or not) is signed in.
 * Depends only on the uid: upgrading an anonymous account keeps the same uid, so the
 * token stays attached to the same backend user. No-op on web and iOS.
 */
export function usePushRegistration() {
    const { user } = useAuth();
    const uid = user?.uid;

    useEffect(() => {
        if (!uid) return;

        let cleanup: (() => void) | undefined;
        let cancelled = false;
        initPushRegistration().then((fn) => {
            if (cancelled) fn();
            else cleanup = fn;
        });

        return () => {
            cancelled = true;
            cleanup?.();
        };
    }, [uid]);
}
