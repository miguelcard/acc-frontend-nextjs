'use client';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';

type QueryErrorProps = {
    message?: string;
    onRetry?: () => void;
};

/**
 * Reusable error state for failed React Query fetches.
 * Shows a user-friendly message with an optional retry button.
 */
export default function QueryError({
    message = 'Something went wrong. Please check your connection and try again.',
    onRetry,
}: QueryErrorProps) {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={2}
            py={6}
            px={2}
        >
            <Typography color="text.secondary" textAlign="center" fontSize="0.95rem">
                {message}
            </Typography>
            {onRetry && (
                <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<RefreshIcon />}
                    onClick={onRetry}
                    size="small"
                >
                    Retry
                </Button>
            )}
        </Box>
    );
}
