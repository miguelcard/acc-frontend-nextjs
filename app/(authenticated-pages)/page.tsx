'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * The app's entry point is always `/` (Capacitor default).
 * We immediately replace it with `/spaces` so there is a single
 * canonical URL for the spaces overview.
 */
export default function RootRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/spaces');
    }, [router]);

    return null;
}
