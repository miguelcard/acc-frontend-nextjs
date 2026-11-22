'use client';
import { useState } from 'react';
import { FirebaseError } from 'firebase/app';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '@/lib/auth/auth-context';
import { getAuthErrorMessage } from '@/lib/auth/auth-errors';
import { queryKeys } from '@/lib/query-keys';
import { SignInForm } from '@/components/auth/SignInForm/sign-in-form';
import { PasswordField } from '@/components/auth/PasswordField/password-field';

type Mode = 'create' | 'signin';

const EMAIL_EXISTS_NOTICE = 'An account with this email already exists. Sign in below instead.';

interface Props {
    handleCloseDialog?: () => void;
}

/**
 * Lets an anonymous user either save their account (attach an email + password, same
 * Firebase UID so no data is lost) or sign in to an account that already exists.
 */
export function AccountAuthForm({ handleCloseDialog }: Props) {
    const { linkWithEmail, sendVerificationEmail, refreshUser } = useAuth();
    const queryClient = useQueryClient();
    const router = useRouter();

    const [mode, setMode] = useState<Mode>('create');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            await linkWithEmail(email.trim(), password);
        } catch (err) {
            if (err instanceof FirebaseError && err.code === 'auth/email-already-in-use') {
                setNotice(EMAIL_EXISTS_NOTICE);
                setMode('signin');
            } else {
                setError(getAuthErrorMessage(err));
            }
            setSubmitting(false);
            return;
        }

        // The account is saved at this point; everything below is best-effort.
        refreshUser();
        await queryClient.invalidateQueries({ queryKey: queryKeys.user });
        try {
            await sendVerificationEmail();
            toast.success('Account saved! Check your inbox to verify your email.');
        } catch {
            toast.success('Account saved! You can verify your email from your profile.');
        }
        handleCloseDialog?.();
    }

    function switchMode(next: Mode) {
        setMode(next);
        setError('');
        setNotice('');
    }

    const isCreate = mode === 'create';

    return (
        <Box display="flex" flexDirection="column" gap={2} pb={2}>
            <Typography variant="body2" color="text.secondary">
                {isCreate
                    ? 'Back up your habits, XP and spaces with an email and password, so you can restore them on a new phone.'
                    : 'Sign in to an existing account. It replaces this guest profile; its current habits and spaces won\'t carry over.'}
            </Typography>

            {isCreate ? (
                <Box component="form" onSubmit={handleCreate} display="flex" flexDirection="column" gap={2}>
                    {error && <Alert severity="error">{error}</Alert>}
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        fullWidth
                        autoComplete="email"
                    />
                    <PasswordField
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        fullWidth
                        autoComplete="new-password"
                        helperText="Minimum 6 characters"
                    />
                    <Button type="submit" variant="contained" color="info" fullWidth disabled={submitting} sx={{ py: 1.2, fontWeight: 700 }}>
                        {submitting ? <CircularProgress size={22} color="inherit" /> : 'Save my account'}
                    </Button>
                </Box>
            ) : (
                <SignInForm
                    initialEmail={email}
                    notice={notice}
                    onSignedIn={() => {
                        handleCloseDialog?.();
                        router.push('/spaces');
                    }}
                />
            )}

            <Typography variant="body2" align="center" color="text.secondary">
                {isCreate ? 'Already have an account?' : 'New here?'}{' '}
                <Button
                    variant="text"
                    size="small"
                    onClick={() => switchMode(isCreate ? 'signin' : 'create')}
                    sx={{ textTransform: 'none', p: 0, minWidth: 0 }}
                >
                    {isCreate ? 'Sign in instead' : 'Save my account instead'}
                </Button>
            </Typography>
        </Box>
    );
}
