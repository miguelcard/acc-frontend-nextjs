import 'server-only';
import { getUser } from '@/lib/fetch-functions';
import { notFound } from 'next/navigation';
import { UserT } from '@/lib/types-and-constants';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ChangeUserAvatarModal from '@/components/profile/ChangeUserAvatarModal/change-user-avatar-modal';
import ChangeUserFields from '@/components/profile/ChangeUserFields/change-user-fields';


/**
 * Page where user sees his profile and can edit his data
 */
export default async function Profile() {

    const res = await getUser();

    if (res.error) {
        console.log("TODO write error message in the GUI, the error can appear here because the user could not be retrieved BUT he was authenticated");
        console.log(" this is unlikely to happen becuse this can only happen if the backend is down or something like that");
        notFound(); // go to custom error page rather.
    }

    const user: UserT = res;

    return (
        <>
            <Container component="section" maxWidth="lg">
                <Box display="flex" flexDirection='column' justifyContent="center" alignItems="center" >
                    <Typography fontSize='1.3em' fontWeight={800} pt={4} pb={6}>
                        Profile
                    </Typography>

                    <Box display='flex' flexDirection='row' alignItems='center' gap={3} >
                        <ChangeUserAvatarModal user={user} />
                        <Typography fontSize='1.6em' fontWeight={600} >
                            {user.username}
                        </Typography>
                    </Box>
                    <Typography fontSize='1em' fontWeight={500} pt={3}>
                        {user.email}
                    </Typography>

                    <ChangeUserFields user={user} />
                    
                </Box>
            </Container>
        </>
    )
}
