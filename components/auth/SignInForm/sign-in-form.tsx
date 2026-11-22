'use client';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '@/lib/auth/auth-context';
import { getAuthErrorMessage } from '@/lib/auth/auth-errors';
import { ForgotPasswordButton } from '@/components/auth/ForgotPasswordButton/forgot-password-button';
import { PasswordField } from '@/components/auth/PasswordField/password-field';

interface Props {
    /** Called after a successful sign-in, once cached data of the previous user was discarded. */
    onSignedIn?: () => void;
    initialEmail?: string;
    /** Optional info message shown above the fields (e.g. "this email already has an account"). */
    notice?: string;
}

/** Email + password sign-in form with a "Forgot password?" action. */
export function SignInForm({ onSignedIn, initialEmail = '', notice }: Props) {
    const { signInWithEmail } = useAuth();
    const queryClient = useQueryClient();

    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await signInWithEmail(email.trim(), password);
            // A different user is now signed in: discard everything cached for the previous one.
            queryClient.clear();
            toast.success('Signed in!');
            onSignedIn?.();
        } catch (err) {
            setError(getAuthErrorMessage(err));
            setSubmitting(false);
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
            {notice && <Alert severity="info">{notice}</Alert>}
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
                autoComplete="current-password"
            />

            <ForgotPasswordButton email={email} />

            <Button type="submit" variant="contained" color="info" fullWidth disabled={submitting} sx={{ py: 1.2, fontWeight: 700 }}>
                {submitting ? <CircularProgress size={22} color="inherit" /> : 'Sign in'}
            </Button>
        </Box>
    );
}
