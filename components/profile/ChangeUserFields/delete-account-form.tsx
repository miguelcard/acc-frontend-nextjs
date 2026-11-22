'use client';
import { useState } from 'react';
import { FirebaseError } from 'firebase/app';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useAuth } from '@/lib/auth/auth-context';
import { getAuthErrorMessage } from '@/lib/auth/auth-errors';
import { deleteAccount } from '@/lib/fetch-mutations';
import { unregisterPush } from '@/lib/push-notifications';
import { PasswordField } from '@/components/auth/PasswordField/password-field';
import { ForgotPasswordButton } from '@/components/auth/ForgotPasswordButton/forgot-password-button';

/** Word anonymous users (who have no password) type to confirm. */
export const DELETE_CONFIRMATION_WORD = 'DELETE';

interface Props {
    handleCloseDialog?: () => void;
}

/**
 * Confirmation form for permanently deleting the account.
 * Registered users confirm with their password (this also re-authenticates them, which the
 * backend requires); anonymous users type a confirmation word since they have no password.
 */
export function DeleteAccountForm({ handleCloseDialog }: Props) {
    const { isAnonymous, user, reauthenticate, signOut } = useAuth();
    const queryClient = useQueryClient();
    const router = useRouter();

    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const needsPassword = isAnonymous === false;
    const canSubmit = needsPassword ? password.length > 0 : confirmation.trim() === DELETE_CONFIRMATION_WORD;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!canSubmit) return;
        setError('');
        setSubmitting(true);

        try {
            if (needsPassword) {
                try {
                    await reauthenticate(password);
                } catch (err) {
                    const wrongPassword = err instanceof FirebaseError
                        && (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential');
                    setError(wrongPassword ? 'Incorrect password.' : getAuthErrorMessage(err));
                    return;
                }
            }

            // Stop in-flight requests: once the account is gone, a request still carrying the old
            // (not yet expired) token would make the backend create an empty user for it again.
            await queryClient.cancelQueries();
            // While still authenticated, so the device stops receiving this account's notifications.
            await unregisterPush();

            const result = await deleteAccount();
            if (result.error) {
                setError(result.error);
                return;
            }

            // The Firebase user no longer exists: end the local session; the app then starts a fresh guest.
            await signOut();
            queryClient.clear();
            toast.success('Your account was deleted.');
            handleCloseDialog?.();
            router.replace('/spaces');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2} pb={2}>
            <Alert severity="warning">
                This permanently deletes your account, your habits and your XP, and removes you from all your
                spaces. Spaces with other members stay and get a new admin. This cannot be undone.
            </Alert>

            {error && <Alert severity="error">{error}</Alert>}

            {needsPassword ? (
                <>
                    <Typography variant="body2" color="text.secondary">
                        Enter your password to confirm.
                    </Typography>
                    <PasswordField
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        autoComplete="current-password"
                    />
                    <ForgotPasswordButton email={user?.email ?? ''} />
                </>
            ) : (
                <>
                    <Typography variant="body2" color="text.secondary">
                        Type <strong>{DELETE_CONFIRMATION_WORD}</strong> to confirm.
                    </Typography>
                    <TextField
                        label="Confirmation"
                        value={confirmation}
                        onChange={(e) => setConfirmation(e.target.value)}
                        fullWidth
                        autoComplete="off"
                        slotProps={{ htmlInput: { autoCapitalize: 'characters' } }}
                    />
                </>
            )}

            <Button
                type="submit"
                variant="contained"
                color="error"
                fullWidth
                disabled={submitting || !canSubmit}
                sx={{ py: 1.2, fontWeight: 700 }}
            >
                {submitting ? <CircularProgress size={22} color="inherit" /> : 'Delete my account'}
            </Button>
        </Box>
    );
}
