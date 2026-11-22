'use client';
import { useEffect, useRef, useState } from 'react';
import { FirebaseError } from 'firebase/app';
import toast from 'react-hot-toast';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useAuth } from '@/lib/auth/auth-context';

/** Seconds the "Resend" button stays disabled after an email was sent (Firebase rate-limits sends). */
export const RESEND_COOLDOWN_SECONDS = 60;

/**
 * Soft, non-blocking nudge asking users with an email account to verify that email.
 * Hidden for anonymous users (no email) and for already verified accounts.
 */
export default function VerifyEmailNotice() {
    const { isAnonymous, isEmailVerified, user, sendVerificationEmail, reloadUser } = useAuth();
    const [cooldown, setCooldown] = useState(0);
    const [sending, setSending] = useState(false);
    const [checking, setChecking] = useState(false);

    const visible = isAnonymous === false && isEmailVerified === false;

    // Tick the resend cooldown down once a second.
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    // The user usually verifies in the browser/mail app and then comes back: re-check silently.
    const reloadRef = useRef(reloadUser);
    reloadRef.current = reloadUser;
    useEffect(() => {
        if (!visible) return;
        const onVisible = () => {
            if (document.visibilityState === 'visible') reloadRef.current().catch(() => {});
        };
        document.addEventListener('visibilitychange', onVisible);
        return () => document.removeEventListener('visibilitychange', onVisible);
    }, [visible]);

    if (!visible) return null;

    async function handleResend() {
        setSending(true);
        try {
            await sendVerificationEmail();
            toast.success('Verification email sent. Check your inbox (and spam folder).');
            setCooldown(RESEND_COOLDOWN_SECONDS);
        } catch (err) {
            if (err instanceof FirebaseError && err.code === 'auth/too-many-requests') {
                toast.error('Too many attempts. Please try again later.');
                setCooldown(RESEND_COOLDOWN_SECONDS);
            } else {
                toast.error('Could not send the verification email. Please try again.');
            }
        } finally {
            setSending(false);
        }
    }

    async function handleCheck() {
        setChecking(true);
        try {
            const verified = await reloadUser();
            if (verified) {
                toast.success('Email verified, thank you!');
            } else {
                toast('Not verified yet. Open the link in the email first.');
            }
        } catch {
            toast.error('Could not check right now. Please try again.');
        } finally {
            setChecking(false);
        }
    }

    return (
        <Box width="100%" px={2} pt={3}>
            <Alert
                severity="info"
                action={
                    <Box display="flex" flexDirection="column" gap={0.5} alignItems="flex-end">
                        <Button size="small" color="inherit" onClick={handleResend} disabled={sending || cooldown > 0}>
                            {cooldown > 0 ? `Resend (${cooldown}s)` : 'Send email'}
                        </Button>
                        <Button size="small" color="inherit" onClick={handleCheck} disabled={checking}>
                            I&apos;ve verified
                        </Button>
                    </Box>
                }
            >
                Verify <strong>{user?.email}</strong> so you can recover your account if you forget your password.
            </Alert>
        </Box>
    );
}
