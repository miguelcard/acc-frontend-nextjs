import 'server-only';
import { SpaceT } from '@/lib/types-and-constants';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { notFound } from 'next/navigation';
import { getSpace } from '@/lib/fetch-functions';
import { BackButtonAutoRouted } from '@/components/shared/back-button-auto-routed';
import { MembersListWithRemove } from '@/components/shared/SpaceMembers/space-members';
import { InviteMembersWithFeedback } from '@/components/space/MoreOptionsMenu/invite-members-with-feedback';
import { Avatar } from '@mui/material';
import { SpaceIconLogic } from '@/components/shared/space-icon';

export default async function SpaceMembersPage(props: { params: Promise<{ id: number }> }) {
    const params = await props.params;
    const { id } = params;
    const space: SpaceT = await getSpace(id);

    if (space?.error) {
        console.log('User requested a space where he does not belong / does not exist');
        notFound();
    }

    return (
        <Container
            component="section"
            maxWidth="md"
            sx={{
                bgcolor: '#f5f5f5',
                minHeight: '100vh',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <CssBaseline />

            {/* Blurred blob background - top left (cyan blue) */}
            <Box
                sx={{
                    position: 'absolute',
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
                    position: 'absolute',
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
