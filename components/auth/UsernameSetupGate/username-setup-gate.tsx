'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { getUser } from '@/lib/fetch-queries';
import { checkUsernameOrEmailExist } from '@/lib/fetch-mutations';
import { usePatchUser } from '@/lib/hooks/mutations';
import { UserT } from '@/lib/types-and-constants';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import NextLink from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';

/**
 * Prefix that the backend assigns to auto-generated usernames for Firebase anonymous users.
 * Used only as a fallback heuristic — the primary check is a localStorage flag.
 */
const AUTO_USERNAME_PREFIX = 'fb_';

function getLocalStorageKey(uid: string): string {
    return `username_configured_${uid}`;
}

/**
 * Yup validation schema for the username field.
 * Reuses the same rules as the original signup form:
 * - 3–20 chars, alphanumeric + dashes/underscores
 * - Async uniqueness check against backend
 */
const usernameValidationSchema = Yup.object().shape({
    username: Yup
        .string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be at most 20 characters')
        .matches(
            /^[a-zA-Z0-9_-]+$/,
            'Username can only contain letters, numbers, dashes, and underscores'
        )
        .test('no-reserved-prefix', 'Username cannot start with "fb_"', function (value) {
            if (!value) return true;
            return !value.toLowerCase().startsWith('fb_');
        })
        .test('unique', 'Username is already taken', async function (value) {
            if (!value || value.length < 3) return true; // skip check for incomplete input
            const exists = await checkUsernameOrEmailExist(value, null);
            return !exists.username_taken;
        }),
});

interface UsernameSetupGateProps {
    children: React.ReactNode;
}

/**
 * Gate component that prompts new anonymous users to choose a personalized username
 * before they can access the authenticated pages.
 *
 * Detection logic:
 * 1. Check localStorage for `username_configured_<firebase_uid>` flag → if set, skip
 * 2. Otherwise, fetch user from backend and check if username starts with the auto-generated prefix
 * 3. If yes → show the "Choose your username" form
 * 4. After submit → set the localStorage flag so they're never prompted again
 */
export function UsernameSetupGate({ children }: UsernameSetupGateProps) {
    const { user } = useAuth();
    const uid = user?.uid;
    const [needsSetup, setNeedsSetup] = useState<boolean | null>(null); // null = checking
    const [submitting, setSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const patchUserMutation = usePatchUser();

    useEffect(() => {
        if (!uid) return;

        const flagKey = getLocalStorageKey(uid);

        // Fast path: already configured
        if (localStorage.getItem(flagKey) === 'true') {
            setNeedsSetup(false);
            return;
        }

        // A different user may have just signed in (e.g. a fresh guest after deleting the account):
        // go back to "checking" so the app is not rendered yet. Otherwise its parallel first requests
        // race with this one while the backend is still creating the new user.
        setNeedsSetup(null);
        let cancelled = false;

        // Slow path: check backend
        getUser()
            .then((backendUser: UserT) => {
                if (cancelled) return;
                if (backendUser.username?.startsWith(AUTO_USERNAME_PREFIX)) {
                    setNeedsSetup(true);
                } else {
                    // Username was already personalized (e.g. set on a previous device)
                    localStorage.setItem(flagKey, 'true');
                    setNeedsSetup(false);
                }
            })
            .catch(() => {
                // Can't determine, let them through rather than blocking
                if (!cancelled) setNeedsSetup(false);
            });

        return () => {
            cancelled = true;
        };
    }, [uid]);

    const formik = useFormik({
        initialValues: { username: '' },
        validationSchema: usernameValidationSchema,
        onSubmit: async (values) => {
            setSubmitting(true);
            setApiError(null);

            const result = await patchUserMutation.mutateAsync({ username: values.username });

            if (result?.error) {
                setApiError(result.error);
                setSubmitting(false);
                return;
            }

            // Success — set flag and proceed to app
            if (user) {
                localStorage.setItem(getLocalStorageKey(user.uid), 'true');
            }
            setNeedsSetup(false);
            setSubmitting(false);
        },
    });

    // Still checking whether setup is needed
    if (needsSetup === null) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress color="secondary" size={60} />
            </Box>
        );
    }

    // Username setup form
    if (needsSetup) {
        return (
            <Container component="main" maxWidth="sm">
                <Box
                    sx={{
                        mt: 14,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5" fontWeight={700} pb={2}>
                        Choose your username
                    </Typography>
                    <Typography variant="body1" color="text.secondary" pb={4} textAlign="center">
                        Your username is how other community members will see you
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={formik.handleSubmit}
                        sx={{
                            mt: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: 280,
                        }}
                    >
                        <TextField
                            sx={{ mb: 2 }}
                            fullWidth
                            type="text"
                            id="username"
                            name="username"
                            placeholder="username"
                            autoComplete="off"
                            spellCheck={false}
                            value={formik.values.username}
                            onChange={(e) => formik.setFieldValue('username', e.target.value.toLowerCase())}
                            onBlur={formik.handleBlur}
                            error={formik.touched.username && Boolean(formik.errors.username)}
                            helperText={(formik.touched.username && formik.errors.username) || 'Usernames are lowercase'}
                            slotProps={{ htmlInput: { autoCapitalize: 'none', autoCorrect: 'off' } }}
                            autoFocus
                        />
                        {apiError && (
                            <Typography color="error" variant="body2" pb={1}>
                                {apiError}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="secondary"
                            disabled={submitting || !formik.isValid || !formik.dirty}
                            sx={{ mt: 3, py: 1.2 }}
                        >
                            {submitting ? <CircularProgress size={24} color="inherit" /> : 'Continue'}
                        </Button>
                        <Typography variant="body1" color="text.primary" fontWeight={600} mt={4} textAlign="center">
                            Already have an account?{' '}
                            <Link component={NextLink} href="/login" underline="always" color="secondary" fontWeight={700}>
                                Log in
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Container>
        );
    }

    // Username is set — render the app
    return <>{children}</>;
}
