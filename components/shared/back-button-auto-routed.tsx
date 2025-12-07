'use client';
import { useRouter } from 'next/navigation';
import { Box, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

/**
 * This Button is a client component that goes back to the previous page in the browser history
 * this is handy for using in the server components as you dont have other way of knowing which page was the 
 * last one that redirected the user to the current one besides the useRouter() hook.
 */
export function BackButtonAutoRouted() {

    const router = useRouter();

    return (
        <Box>
            <IconButton
                onClick={() => router.back()}
                aria-label="spaces"
                size="medium"
            >
                <ArrowBack />
            </IconButton>
        </Box>
    );
}