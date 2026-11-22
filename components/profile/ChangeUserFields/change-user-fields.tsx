'use client';
import { UserT } from "@/lib/types-and-constants";
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import ContentCard from '@/components/shared/ContentCard/content-card';
import UserFieldButton from './user-field-button';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import toast from 'react-hot-toast';
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import DialogModal from '@/components/shared/DialogModal/dialog-modal';
import React from 'react';
import { ChangeNameFormikStepper } from './change-name-formik-stepper';
import { LogoutFormikStepper } from './logout-formik-stepper';
import { AccountAuthForm } from './account-auth-form';
import { useAuth } from '@/lib/auth/auth-context';
import { getDisplayEmail } from '@/lib/utils/email';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { DeleteAccountForm } from './delete-account-form';

interface Props {
    user: UserT;
}

export default function ChangeUserFields({user} : Props) {

    const { isAnonymous } = useAuth();

    interface UserFieldModal {
        button: React.ReactElement;
        modalTitle?: React.ReactElement;
        modalBody?: React.ReactElement;
        /** Plain navigation row: rendered without a modal. */
        isLink?: boolean;
    }

    const userFieldModals : UserFieldModal[] = [
        {
            button: <UserFieldButton icon={<PersonIcon />} text={'Name'} />,
            modalTitle: <Typography fontSize={'1.1em'} fontWeight={600} >What&apos;s your name?</Typography>,
            modalBody: <ChangeNameFormikStepper user={user} />
        },
        // Guests only have a generated placeholder email, so there is nothing meaningful to show.
        ...(getDisplayEmail(user.email) ? [{
            button: <UserFieldButton icon={<EmailIcon />} text={'Email'} isEnabled={false} valueToShow={user.email}/>,
            modalTitle: <Typography fontSize={'0.9em'} fontWeight={600} >Your email is</Typography>,
            modalBody: <Typography fontSize={'0.9em'} fontWeight={500} textAlign={'center'} sx={{ wordBreak: 'break-all' }}>{user.email}</Typography>
        }] : []),
        {
            button: <UserFieldButton icon={<BadgeIcon />} text={'Username'} isEnabled={false} valueToShow={user.username}/>,
            modalTitle: <Typography fontSize={'0.9em'} fontWeight={600} >Your username is</Typography>,
            modalBody: (
                <Box display='flex' alignItems='center' justifyContent='center' gap={0.5}>
                    <Typography fontSize={'1.2em'} fontWeight={500} textAlign={'center'}>{user.username}</Typography>
                    <IconButton
                        size='small'
                        onClick={() => {
                            navigator.clipboard.writeText(user.username);
                            toast('Username copied to clipboard', { icon: '\ud83d\udccb' });
                        }}
                        sx={{ color: 'text.secondary' }}
                    >
                        <ContentCopyIcon sx={{ fontSize: '0.9rem' }} />
                    </IconButton>
                </Box>
            )
        },
        // Anonymous users can save their account; registered users can log out
        // (logging out an anonymous user would destroy the account permanently).
        isAnonymous === false
            ? {
                button: <UserFieldButton icon={<LogoutIcon />} text={'Log out'} />,
                modalTitle: <Typography fontSize={'1.1em'} fontWeight={600} >Log out?</Typography>,
                modalBody: <LogoutFormikStepper />
            }
            : {
                button: <UserFieldButton icon={<PersonAddIcon />} text={'Save your account'} />,
                modalTitle: <Typography fontSize={'1.1em'} fontWeight={600} >Save your account</Typography>,
                modalBody: <AccountAuthForm />
            },
        // Returning users (e.g. after a reinstall) need a way back into their existing account.
        ...(isAnonymous === false ? [] : [{
            button: <UserFieldButton icon={<LoginIcon />} text={'Log in to an existing account'} href="/login" />,
            isLink: true,
        }]),
        // Available to everyone: guests also have personal data stored on the server.
        {
            button: <UserFieldButton icon={<DeleteForeverIcon />} text={'Delete account'} />,
            modalTitle: <Typography fontSize={'1.1em'} fontWeight={600} >Delete your account?</Typography>,
            modalBody: <DeleteAccountForm />
        },
    ];

    return (
        <>
            <Box alignSelf='stretch' sx={{mt:6, mx: 4}} >
                <Typography  fontSize='1.1em' fontWeight={700} >
                    About you
                </Typography>
            </Box>
            
            <ContentCard sx={{ mt: 2 }}>
                <List>
                    {userFieldModals.map((modal, index) =>
                        <React.Fragment key={index}>
                            {modal.isLink ? modal.button : (
                                <DialogModal
                                    button={modal.button}
                                    childrenTitle={modal.modalTitle}
                                    childrenBody={modal.modalBody}
                                />
                            )}
                            {index < userFieldModals.length - 1 && <Divider variant="middle" component="li" />}
                        </React.Fragment>
                    )}
                </List>
            </ContentCard>

            {/* other info to put in here KISS:
                    birthdate? (future)
                    gender? (future)
                    tags (future)
                    languages (future) */}
        </>

    )
}
