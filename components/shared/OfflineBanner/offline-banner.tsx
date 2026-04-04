'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { useNetworkStatus } from '@/lib/hooks/useNetworkStatus';

/**
 * Thin persistent banner shown at the top of the screen when the device
 * is offline.  Auto-hides the moment connectivity is restored.
 *
 * Place this component once inside the root layout (or any top-level
 * client boundary) — it is a no-op when the user is online.
 */
export default function OfflineBanner() {
    const isOnline = useNetworkStatus();

    if (isOnline) return null;

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                width: '100%',
                py: 0.6,
                bgcolor: '#424242',       // dark grey — neutral, not alarming
                color: '#fff',
                zIndex: 99999999,         // above everything including toasts
                position: 'sticky',
                top: 0,
            }}
        >
            <WifiOffIcon sx={{ fontSize: 16 }} />
            <Typography fontSize="0.8rem" fontWeight={600}>
                You&apos;re offline
            </Typography>
        </Box>
    );
}
