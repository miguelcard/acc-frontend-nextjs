import { FirebaseError } from 'firebase/app';

/** Maps Firebase email/password auth errors to messages that are safe to show the user. */
export function getAuthErrorMessage(err: unknown): string {
    if (err instanceof FirebaseError) {
        switch (err.code) {
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
            case 'auth/user-not-found':
                return 'Incorrect email or password.';
            case 'auth/weak-password':
                return 'Password must be at least 6 characters.';
            case 'auth/invalid-email':
                return 'Please enter a valid email address.';
            case 'auth/too-many-requests':
                return 'Too many attempts. Please try again later.';
            case 'auth/network-request-failed':
                return 'Network error. Check your connection and try again.';
            case 'auth/user-disabled':
                return 'This account has been disabled.';
        }
    }
    return 'Something went wrong. Please try again.';
}
