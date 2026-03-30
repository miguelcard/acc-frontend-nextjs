'use client';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import toast from 'react-hot-toast';
import ChangeUserAvatarModal from '@/components/profile/ChangeUserAvatarModal/change-user-avatar-modal';
import ChangeUserFields from '@/components/profile/ChangeUserFields/change-user-fields';
import { useUser } from '@/lib/hooks/queries';
import QueryError from '@/components/shared/QueryError/query-error';


/**
 * Page where user sees his profile and can edit his data
 */
export default function Profile() {
    const { data: user, isLoading, isError, refetch } = useUser();

    if (isLoading && !user) {
        return <Box py={6} display="flex" justifyContent="center"><CircularProgress color="secondary" size={60} /></Box>;
    }

    if ((isError && !user) || !user) {
        return (
            <Container component="section" maxWidth="lg">
                <QueryError onRetry={() => refetch()} />
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
                        <ChangeUserAvatarModal user={user} />
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

                    <ChangeUserFields user={user} />
                    
                </Box>
            </Container>
        </>
    )
}
