'use client';
import { useEffect, useState } from 'react';
import { getUser } from '@/lib/fetch-functions';
import { UserT } from '@/lib/types-and-constants';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import toast from 'react-hot-toast';
import ChangeUserAvatarModal from '@/components/profile/ChangeUserAvatarModal/change-user-avatar-modal';
import ChangeUserFields from '@/components/profile/ChangeUserFields/change-user-fields';


/**
 * Page where user sees his profile and can edit his data
 */
export default function Profile() {
    const [user, setUser] = useState<UserT | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        getUser().then((res) => {
            if (res.error) {
                console.warn('Failed to fetch user data:', res.error);
                setError(true);
            } else {
                setUser(res);
            }
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <Box py={6} display="flex" justifyContent="center"><CircularProgress color="secondary" size={60} /></Box>;
    }

    if (error || !user) {
        return (
            <Container component="section" maxWidth="lg">
                <Box display="flex" justifyContent="center" pt={6}>
                    <Typography color="error">Failed to load profile data.</Typography>
                </Box>
            </Container>
        );
    }

    return (
        <>
            <Container component="section" maxWidth="lg">
                <Box display="flex" flexDirection='column' justifyContent="center" alignItems="center" >
                    <Typography fontSize='1.3em' fontWeight={800} pt={4} pb={6}>
                        Profile
                    </Typography>

                    <Box display='flex' flexDirection='row' alignItems='center' gap={3} maxWidth='100%' px={2}>
                        <ChangeUserAvatarModal user={user} onUserUpdate={setUser} />
                        <Box display='flex' alignItems='center' gap={0.5} minWidth={0}>
                            <Typography
                                fontSize='1.6em'
                                fontWeight={600}
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {user.username}
                            </Typography>
                            <IconButton
                                size='small'
                                onClick={() => {
                                    navigator.clipboard.writeText(user.username);
                                    toast('Username copied to clipboard', { icon: '📋' });
                                }}
                                sx={{ color: 'text.secondary' }}
                            >
                                <ContentCopyIcon sx={{ fontSize: '0.9rem' }} />
                            </IconButton>
                        </Box>
                    </Box>
                    <Typography
                        fontSize='1em'
                        fontWeight={500}
                        pt={3}
                        sx={{
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            px: 2,
                        }}
                    >
                        {user.email}
                    </Typography>

                    <ChangeUserFields user={user} onUserUpdate={setUser} />
                    
                </Box>
            </Container>
        </>
    )
}
