import { Box } from '@mui/material';

/**
 * Reusable blurred blob background component
 * Features cyan blue blob (top-left) and purple blob (bottom-right)
 * Use within a container with position: 'relative' and overflow: 'hidden'
 */
export function BlurredBlobBackground() {
    return (
        <>
            {/* Blurred blob background - top left (cyan blue) */}
            <Box
                sx={{
                    position: 'fixed',
                    top: '-150px',
                    left: '-150px',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)',
                    filter: 'blur(80px)',
                    opacity: 0.15,
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />
            {/* Blurred blob background - bottom right (purple) */}
            <Box
                sx={{
                    position: 'fixed',
                    bottom: '-400px',
                    right: '-250px',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
                    filter: 'blur(80px)',
                    opacity: 0.15,
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />
        </>
    );
}
