import {
    signInAnonymously,
    onAuthStateChanged as firebaseOnAuthStateChanged,
    signOut as firebaseSignOut,
    signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
    sendPasswordResetEmail as firebaseSendPasswordResetEmail,
    sendEmailVerification as firebaseSendEmailVerification,
    reauthenticateWithCredential,
    linkWithCredential,
    EmailAuthProvider,
    User,
    NextOrObserver,
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

/**
 * Upgrades the current anonymous Firebase session to an email/password account.
 * The Firebase UID stays the same — no data is lost on the backend.
 *
 * Throws `auth/email-already-in-use` if an account with that email already exists.
 * In that case call `signInWithEmail` instead.
 */
export async function linkWithEmail(email: string, password: string): Promise<User> {
    const user = auth.currentUser;
    if (!user) throw new Error('No user session to upgrade');
    const credential = EmailAuthProvider.credential(email, password);
    const result = await linkWithCredential(user, credential);
    // Force-refresh the token so the next API call carries the new email/password provider info.
    await result.user.getIdToken(true);
    return result.user;
}

/**
 * Signs in with an existing email/password Firebase account.
 * Used when `linkWithEmail` fails with `auth/email-already-in-use`.
 */
export async function signInWithEmail(email: string, password: string): Promise<User> {
    const result = await firebaseSignInWithEmailAndPassword(auth, email, password);
    return result.user;
}

/**
 * Asks Firebase to email a password reset link to the given address.
 * Firebase sends the email and hosts the reset page, no backend involved.
 *
 * Resolves silently when no account exists for the email (`auth/user-not-found`), so callers
 * can show one generic message and the UI never reveals which emails are registered.
 * Other errors (e.g. `auth/invalid-email`, `auth/too-many-requests`) are rethrown.
 */
export async function sendPasswordReset(email: string): Promise<void> {
    try {
        await firebaseSendPasswordResetEmail(auth, email.trim());
    } catch (error) {
        if ((error as { code?: string })?.code === 'auth/user-not-found') return;
        throw error;
    }
}

/**
 * Sends a verification link to the current user's email address.
 * Throws if there is no user, or if the user is anonymous / has no email (nothing to verify).
 * Firebase may throw `auth/too-many-requests` when called repeatedly.
 */
export async function sendVerificationEmail(): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('No user session');
    if (user.isAnonymous || !user.email) throw new Error('The current user has no email to verify');
    await firebaseSendEmailVerification(user);
}

/**
 * Re-authenticates the current email/password user and refreshes the ID token, so the new token
 * carries a fresh `auth_time`. Needed before sensitive actions such as deleting the account.
 * Throws Firebase errors (e.g. `auth/invalid-credential` for a wrong password).
 */
export async function reauthenticateWithPassword(password: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('No user session');
    if (!user.email) throw new Error('The current user has no email to re-authenticate with');
    await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, password));
    await user.getIdToken(true);
}

/**
 * Re-fetches the current user from Firebase so `emailVerified` reflects a link that
 * was clicked after sign-in (the client-side User object does not update by itself).
 */
export async function reloadCurrentUser(): Promise<User> {
    const user = auth.currentUser;
    if (!user) throw new Error('No user session');
    await user.reload();
    return user;
}

// ============================================================
// Future: Account Linking (Phase 2 — social providers)
// ============================================================
//
// export async function linkWithGoogle(): Promise<User> { ... }
// export async function linkWithApple(): Promise<User> { ... }
