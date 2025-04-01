'use client';
import { UserT } from "@/lib/types-and-constants";
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import ContentCard from '@/components/shared/ContentCard/content-card';
import UserFieldButton from './user-field-button';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import LogoutIcon from '@mui/icons-material/Logout';
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import DialogModal from '@/components/shared/DialogModal/dialog-modal';
import React from 'react';
import { ChangeNameFormikStepper } from './change-name-formik-stepper';
import { LogoutFormikStepper } from './logout-formik-stepper';

interface Props {
    user: UserT;
}

export default function ChangeUserFields({user} : Props) {

    interface UserFieldModal {
        button: React.ReactElement;
        modalTitle?: React.ReactElement;
        modalBody?: React.ReactElement;
    }

    const userFieldModals : UserFieldModal[] = [
        {
            button: <UserFieldButton icon={<PersonIcon />} text={'Name'} />,
            modalTitle: <Typography fontSize={'1.1em'} fontWeight={600} >What's your name?</Typography>,
            modalBody: <ChangeNameFormikStepper user={user} />
        },
        {
            button: <UserFieldButton icon={<EmailIcon />} text={'Email'} isEnabled={false} valueToShow={user.email}/>,
            modalTitle: <Typography fontSize={'0.9em'} fontWeight={600} >Your email is</Typography>,
            modalBody: <Typography fontSize={'1.1em'} fontWeight={500} textAlign={'center'} >{user.email}</Typography>
        },
        {
            button: <UserFieldButton icon={<BadgeIcon />} text={'Username'} isEnabled={false} valueToShow={user.username}/>,
            modalTitle: <Typography fontSize={'0.9em'} fontWeight={600} >Your username is</Typography>,
            modalBody: <Typography fontSize={'1.2em'} fontWeight={500} textAlign={'center'} >{user.username}</Typography>
        },
        {
            button: <UserFieldButton icon={<LogoutIcon />} text={'Log out'} />,
            modalTitle: <Typography fontSize={'1.1em'} fontWeight={600} >Log out?</Typography>,
            modalBody: <LogoutFormikStepper />
        }
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
                            <DialogModal
                                button={modal.button}
                                childrenTitle={modal.modalTitle}
                                childrenBody={modal.modalBody}
                            />
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
