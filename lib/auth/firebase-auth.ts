import {
    signInAnonymously,
    onAuthStateChanged as firebaseOnAuthStateChanged,
    signOut as firebaseSignOut,
    User,
    NextOrObserver,
    // Future: uncomment these for social login account linking
    // linkWithPopup,
    // linkWithCredential,
    // GoogleAuthProvider,
    // OAuthProvider,
    // EmailAuthProvider,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

/**
 * Signs in anonymously if there is no current user.
 * If a user session already exists (e.g., returning user), Firebase restores it automatically.
 * @returns the Firebase User
 */
export async function initAnonymousAuth(): Promise<User> {
    if (auth.currentUser) {
        return auth.currentUser;
    }
    const credential = await signInAnonymously(auth);
    return credential.user;
}

/**
 * Returns the Firebase ID token (JWT) for the current user.
 * This token is sent as `Authorization: Bearer <token>` to your backend.
 * 
 * @param forceRefresh - if true, forces a token refresh even if not expired (default: false)
 * @returns the ID token string, or null if no user is signed in
 */
export async function getIdToken(forceRefresh: boolean = false): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) {
        console.warn('getIdToken called but no user is signed in');
        return null;
    }
    return user.getIdToken(forceRefresh);
}

/**
 * Subscribes to auth state changes (sign in, sign out, token refresh).
 * @param callback - receives the User object or null
 * @returns unsubscribe function
 */
export function onAuthStateChanged(callback: NextOrObserver<User | null>): () => void {
    return firebaseOnAuthStateChanged(auth, callback);
}

/**
 * Checks if the currently signed-in user is anonymous.
 * Used to decide when to show the "Save your account" prompt.
 * @returns true if anonymous, false if linked/permanent, null if no user
 */
export function isAnonymous(): boolean | null {
    const user = auth.currentUser;
    if (!user) return null;
    return user.isAnonymous;
}

/**
 * Signs out the current user (anonymous or otherwise).
 */
export async function signOutUser(): Promise<void> {
    await firebaseSignOut(auth);
}

// ============================================================
// Future: Account Linking (Phase 2)
// ============================================================
//
// When implementing "Save your account" / social login:
//
// export async function linkWithGoogle(): Promise<User> {
//     const user = auth.currentUser;
//     if (!user) throw new Error('No user to link');
//     const provider = new GoogleAuthProvider();
//     const result = await linkWithPopup(user, provider);
//     return result.user;
// }
//
// export async function linkWithApple(): Promise<User> {
//     const user = auth.currentUser;
//     if (!user) throw new Error('No user to link');
//     const provider = new OAuthProvider('apple.com');
//     const result = await linkWithPopup(user, provider);
//     return result.user;
// }
//
// export async function linkWithEmail(email: string, password: string): Promise<User> {
//     const user = auth.currentUser;
//     if (!user) throw new Error('No user to link');
//     const credential = EmailAuthProvider.credential(email, password);
//     const result = await linkWithCredential(user, credential);
//     return result.user;
// }
