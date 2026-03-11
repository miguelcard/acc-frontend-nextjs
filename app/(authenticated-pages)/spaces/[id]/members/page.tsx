'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { SpaceT } from '@/lib/types-and-constants';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import { getSpace } from '@/lib/fetch-functions';
import { BackButtonAutoRouted } from '@/components/shared/back-button-auto-routed';
import { MembersListWithRemove } from '@/components/shared/SpaceMembers/space-members';
import { InviteMembersWithFeedback } from '@/components/space/MoreOptionsMenu/invite-members-with-feedback';
import { Avatar } from '@mui/material';
import { SpaceIconLogic } from '@/components/shared/space-icon';

export default function SpaceMembersPage() {
    const params = useParams();
    const id = Number(params.id);
    const [space, setSpace] = useState<SpaceT | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        getSpace(id).then((res) => {
            if (res?.error) {
                console.log('User requested a space where he does not belong / does not exist');
                setError(true);
            } else {
                setSpace(res);
            }
            setLoading(false);
        });
    }, [id]);

    if (loading) {
        return <Box py={6} display="flex" justifyContent="center"><CircularProgress color="secondary" size={60} /></Box>;
    }

    if (error || !space) {
        return (
            <Container component="section" maxWidth="md">
                <Box display="flex" justifyContent="center" pt={6}>
                    <Typography color="error">Space not found.</Typography>
                </Box>
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
