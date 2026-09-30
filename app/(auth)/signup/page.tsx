'use client';

/**
 * Signup page — invite-only.
 * Requires a valid ?invite=<token> query parameter.
 * Upgrades the current anonymous Firebase session to email/password (same UID, no data loss).
 * If the email is already taken in Firebase, falls back to sign-in mode.
 */

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FirebaseError } from 'firebase/app';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { useAuth } from '@/lib/auth/auth-context';
import { getInviteDetails, acceptInvite } from '@/lib/fetch-mutations';

type Mode = 'signup' | 'signin';

function SignUpContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { linkWithEmail, signInWithEmail, isAnonymous } = useAuth();

    // A registered (non-anonymous) user opening an invite link, e.g. via a deep link,
    // must not go through linking again: Firebase would reject it.
    const alreadyRegistered = isAnonymous === false;

    const token = searchParams.get('invite') ?? '';

    const [spaceName, setSpaceName] = useState('');
    const [maskedEmail, setMaskedEmail] = useState('');
    const [inviteError, setInviteError] = useState('');
    const [inviteLoading, setInviteLoading] = useState(true);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mode, setMode] = useState<Mode>('signup');
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    // Validate the invite token on mount
    useEffect(() => {
        if (!token) {
            setInviteError('No invite token found. Signup requires an invitation link.');
            setInviteLoading(false);
            return;
        }
        getInviteDetails(token).then((data) => {
            if (data.error) {
                setInviteError(data.error);
            } else {
                setSpaceName(data.space_name ?? '');
                setMaskedEmail(data.masked_email ?? '');
            }
            setInviteLoading(false);
        });
    }, [token]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError('');
        setSubmitting(true);

        try {
            // Registered users already have an email account; the backend verifies
            // it matches the invite, so only anonymous users need linking / sign-in.
            if (!alreadyRegistered) {
                if (mode === 'signup') {
                    // Upgrade anonymous session → email/password (same Firebase UID)
                    await linkWithEmail(email, password);
                } else {
                    // Sign in with existing account
                    await signInWithEmail(email, password);
                }
            }

            // Backend syncs email automatically on next request (authentication.py).
            // Accept the invite — backend checks request.user.email === invite.email.
            const result = await acceptInvite(token);
            if (result.error) {
                setFormError(result.error);
                setSubmitting(false);
                return;
            }

            router.push('/spaces');
        } catch (err) {
            if (err instanceof FirebaseError) {
                if (err.code === 'auth/email-already-in-use') {
                    setMode('signin');
                    setFormError('An account with this email already exists. Sign in below to accept the invite.');
                } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                    setFormError('Incorrect password. Please try again.');
                } else if (err.code === 'auth/weak-password') {
                    setFormError('Password must be at least 6 characters.');
                } else if (err.code === 'auth/invalid-email') {
                    setFormError('Please enter a valid email address.');
                } else {
                    setFormError('Something went wrong. Please try again.');
                }
            } else {
                setFormError('Something went wrong. Please try again.');
            }
            setSubmitting(false);
        }
    }

    if (inviteLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress color="secondary" />
            </Box>
        );
    }

    if (inviteError) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={8} px={2}>
                <Alert severity="error" sx={{ maxWidth: 480, width: '100%' }}>{inviteError}</Alert>
            </Box>
        );
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="60vh"
            px={2}
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 2 }}
            >
                <Box sx={{ mb: 1 }}>
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                        {alreadyRegistered ? 'Join space' : mode === 'signup' ? 'Create your account' : 'Sign in to accept invite'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        You&apos;ve been invited to join <strong>{spaceName}</strong>.
                        {maskedEmail && <> This invite is for <strong>{maskedEmail}</strong>.</>}
                    </Typography>
                </Box>

                {formError && <Alert severity={mode === 'signin' ? 'info' : 'error'}>{formError}</Alert>}

                {alreadyRegistered ? (
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={submitting}
                        sx={{ py: 1.5, fontWeight: 700 }}
                    >
                        {submitting ? <CircularProgress size={22} color="inherit" /> : 'Join space'}
                    </Button>
                ) : (<>
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                    autoComplete="email"
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    fullWidth
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    helperText={mode === 'signup' ? 'Minimum 6 characters' : undefined}
                />

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={submitting}
                    sx={{ py: 1.5, fontWeight: 700 }}
                >
                    {submitting
                        ? <CircularProgress size={22} color="inherit" />
                        : mode === 'signup' ? 'Create account & join space' : 'Sign in & join space'
                    }
                </Button>

                {mode === 'signup' && (
                    <Typography variant="body2" align="center" color="text.secondary">
                        Already have an account?{' '}
                        <Button
                            variant="text"
                            size="small"
                            onClick={() => { setMode('signin'); setFormError(''); }}
                            sx={{ textTransform: 'none', p: 0, minWidth: 0 }}
                        >
                            Sign in instead
                        </Button>
                    </Typography>
                )}
                </>)}
            </Box>
        </Box>
    );
}

export default function SignUp() {
    return (
        <Suspense fallback={
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress color="secondary" />
            </Box>
        }>
            <SignUpContent />
        </Suspense>
    );
}
