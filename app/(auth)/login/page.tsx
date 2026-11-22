'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import NextLink from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import { SignInForm } from '@/components/auth/SignInForm/sign-in-form';

/**
 * Login page: lets someone with an existing email account sign in
 * (e.g. after reinstalling the app or on a new phone).
 */
export default function Login() {
    const router = useRouter();
    const { isAnonymous } = useAuth();
    const alreadyRegistered = isAnonymous === false;

    // Nothing to do here for a user who is already signed in with an account.
    useEffect(() => {
        if (alreadyRegistered) router.replace('/spaces');
    }, [alreadyRegistered, router]);

    if (alreadyRegistered) return null;

    return (
        <Container component="main" maxWidth="xs">
            <Box display="flex" flexDirection="column" gap={2} mt={8} px={1}>
                <Typography component="h1" variant="h5" fontWeight={700}>
                    Log in
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Sign in with the email and password of your existing account.
                </Typography>
                <Alert severity="warning">
                    The guest profile on this device will be replaced. Its habits and spaces won&apos;t be carried over.
                </Alert>
                <SignInForm onSignedIn={() => router.replace('/spaces')} />
                <Button component={NextLink} href="/spaces" variant="text" color="inherit" sx={{ textTransform: 'none' }}>
                    Continue as guest
                </Button>
            </Box>
        </Container>
    );
}
