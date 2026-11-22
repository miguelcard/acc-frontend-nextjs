'use client';
import { useState } from 'react';
import { FirebaseError } from 'firebase/app';
import toast from 'react-hot-toast';
import Button from '@mui/material/Button';
import { useAuth } from '@/lib/auth/auth-context';

interface Props {
    /** The email typed in the surrounding sign-in form. */
    email: string;
}

/** "Forgot password?" button: emails a reset link to the address typed in the form. */
export function ForgotPasswordButton({ email }: Props) {
    const { sendPasswordReset } = useAuth();
    const [sending, setSending] = useState(false);

    async function handleClick() {
        if (!email.trim()) {
            toast.error('Enter your email above first.');
            return;
        }
        setSending(true);
        try {
            await sendPasswordReset(email);
            // Same message whether or not the account exists, so emails can't be probed.
            toast.success('If an account exists for that email, a reset link is on its way.');
        } catch (err) {
            const code = err instanceof FirebaseError ? err.code : '';
            if (code === 'auth/invalid-email') {
                toast.error('Please enter a valid email address.');
            } else if (code === 'auth/too-many-requests') {
                toast.error('Too many attempts. Please try again later.');
            } else {
                toast.error('Could not send the reset email. Please try again.');
            }
        } finally {
            setSending(false);
        }
    }

    return (
        <Button
            variant="text"
            size="small"
            onClick={handleClick}
            disabled={sending}
            sx={{ textTransform: 'none', p: 0, minWidth: 0, alignSelf: 'flex-end' }}
        >
            Forgot password?
        </Button>
    );
}
