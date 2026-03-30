'use client';
import { usePathname } from 'next/navigation';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import { BackButtonAutoRouted } from '@/components/shared/back-button-auto-routed';
import { MembersListWithRemove } from '@/components/shared/SpaceMembers/space-members';
import { InviteMembersWithFeedback } from '@/components/space/MoreOptionsMenu/invite-members-with-feedback';
import { Avatar } from '@mui/material';
import { SpaceIconLogic } from '@/components/shared/space-icon';
import { useSpace } from '@/lib/hooks/queries';
import { useAuth } from '@/lib/auth/auth-context';
import QueryError from '@/components/shared/QueryError/query-error';

/**
 * Extract the numeric space ID from the URL pathname.
 * Uses usePathname() which is reactive and always reflects the real browser
 * URL — unlike useParams() which may return the pre-rendered placeholder
 * slug ('_') in Capacitor static export.
 */
function useSpaceIdFromUrl(): number {
    const pathname = usePathname();
    const parts = pathname.split('/').filter(Boolean);
    if (parts[0] === 'spaces' && parts.length >= 2) {
        const id = Number(parts[1]);
        if (!isNaN(id) && id > 0) return id;
    }
    return NaN;
}

export default function SpaceMembersClient() {
    const id = useSpaceIdFromUrl();
    const { loading: authLoading } = useAuth();
    const { data: space, isLoading, isError } = useSpace(id);

    if ((authLoading || isLoading) && !space) {
        return <Box py={6} display="flex" justifyContent="center"><CircularProgress color="secondary" size={60} /></Box>;
    }

    if ((isError && !space) || !space) {
        return (
            <Container component="section" maxWidth="md">
                <QueryError message="Space not found." onRetry={() => window.location.reload()} />
            </Container>
        );
    }

    return (
        <Container
            component="section"
            maxWidth="md"
            sx={{
                minHeight: '100vh',
                position: 'relative',
            }}
        >
            <CssBaseline />

            {/* Content wrapper - positioned above blobs */}
            <Box display="flex" flexDirection="column" width="100%" py={3} gap={2} position="relative" zIndex={1}>
                {/* Back button and Space icon */}
                <Box display="flex" alignItems="center" justifyContent="space-between" position="relative" pt={1}>
                    <Box width="60px">
                        <BackButtonAutoRouted />
                    </Box>
                    <Box position="absolute" left="50%" sx={{ transform: 'translateX(-50%)' }}>
                        <Avatar sx={{ width: 66, height: 66, borderRadius: '50%', bgcolor: 'grey.500' }} variant={'rounded'}>
                            <SpaceIconLogic iconAlias={space.icon_alias} size={'2xl'} />
                        </Avatar>
                    </Box>
                </Box>

                {/* Centered Members title */}
                <Box display="flex" flexDirection="column" alignItems="center" gap={1} pt={2} >
                    <Typography variant="h5" fontWeight={600}>
                        Members
                    </Typography>
                </Box>

                {/* Members Section */}
                <Box>
                    <MembersListWithRemove spaceId={id} />
                </Box>

                {/* Invite New Members Section */}
                <Box>
                    <InviteMembersWithFeedback spaceId={id} />
                </Box>
            </Box>
        </Container>
    );
}
