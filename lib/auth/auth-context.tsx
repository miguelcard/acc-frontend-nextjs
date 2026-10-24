'use client';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from 'firebase/auth';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import {
    initAnonymousAuth,
    onAuthStateChanged,
    getIdToken as getFirebaseIdToken,
    signOutUser,
    linkWithEmail,
    signInWithEmail,
} from '@/lib/auth/firebase-auth';
import { unregisterPush } from '@/lib/push-notifications';

// ---- Loading Screen ----

/** Full-screen spinner shown while Firebase auth is initializing */
function AuthLoadingScreen() {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
        >
            <CircularProgress color="secondary" size={80} />
        </Box>
    );
}

// ---- Types ----

interface AuthContextType {
    /** The current Firebase user (anonymous or linked). Null if not yet initialized. */
    user: User | null;
    /** True while Firebase auth is initializing / restoring session */
    loading: boolean;
    /** Whether the current user is anonymous (true), linked (false), or unknown (null) */
    isAnonymous: boolean | null;
    /** Returns a fresh Firebase ID token JWT for API calls */
    getIdToken: (forceRefresh?: boolean) => Promise<string | null>;
    /** Signs out the current user */
    signOut: () => Promise<void>;
    /**
     * Upgrades the anonymous session to email/password (same Firebase UID — no data loss).
     * Throws `auth/email-already-in-use` if an account with that email already exists.
     */
    linkWithEmail: (email: string, password: string) => Promise<User>;
    /** Signs in with an existing email/password account (different UID from anonymous). */
    signInWithEmail: (email: string, password: string) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---- Provider ----

interface AuthProviderProps {
    children: React.ReactNode;
}

/**
 * Wraps the app and provides Firebase auth state.
 * - Auto-signs in anonymously on first load if no user session exists.
 * - Listens to auth state changes and keeps the context in sync.
 * - Exposes `getIdToken()` for making authenticated API calls.
 */
export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen for auth state changes (fires on sign-in, sign-out, token refresh)
        const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                // User exists (either restored session or just signed in)
                setUser(firebaseUser);
                setLoading(false);
            } else {
                // No user — sign in anonymously
                try {
                    const anonUser = await initAnonymousAuth();
                    setUser(anonUser);
                } catch (error) {
                    console.error('Anonymous auth failed:', error);
                    setUser(null);
                } finally {
                    setLoading(false);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const getIdToken = useCallback(async (forceRefresh: boolean = false): Promise<string | null> => {
        return getFirebaseIdToken(forceRefresh);
    }, []);

    const signOut = useCallback(async (): Promise<void> => {
        // Must run while still authenticated; never throws, so it cannot block sign-out.
        await unregisterPush();
        await signOutUser();
        setUser(null);
    }, []);

    const value: AuthContextType = {
        user,
        loading,
        isAnonymous: user?.isAnonymous ?? null,
        getIdToken,
        signOut,
        linkWithEmail,
        signInWithEmail,
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? <AuthLoadingScreen /> : children}
        </AuthContext.Provider>
    );
}

// ---- Hook ----

/**
 * Hook to access Firebase auth state and methods from any client component.
 * 
 * Usage:
 * ```tsx
 * const { user, loading, isAnonymous, getIdToken, signOut } = useAuth();
 * ```
 */
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an <AuthProvider>');
    }
    return context;
}
