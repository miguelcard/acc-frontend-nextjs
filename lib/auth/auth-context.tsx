'use client';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
    initAnonymousAuth,
    onAuthStateChanged,
    getIdToken as getFirebaseIdToken,
    signOutUser,
} from '@/lib/auth/firebase-auth';

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
    // Future: add linkWithGoogle, linkWithApple, linkWithEmail here
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
        await signOutUser();
        setUser(null);
    }, []);

    const value: AuthContextType = {
        user,
        loading,
        isAnonymous: user?.isAnonymous ?? null,
        getIdToken,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
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
