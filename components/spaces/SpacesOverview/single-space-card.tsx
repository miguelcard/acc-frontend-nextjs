'use client';
import { ubuntu } from '@/styles/fonts/fonts';
import { Avatar, Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import React from 'react';
import { useRouter } from 'next/navigation';
import { grey } from '@mui/material/colors';
import { MoreOptionsMenu } from '@/components/space/MoreOptionsMenu/more-options-menu';
import { SpaceDetailed } from '@/lib/types-and-constants';
import { setMaxStringLength } from '@/lib/client-utils';
import ContentCard from '@/components/shared/ContentCard/content-card';
import { InviteMembersModalWithFeedback } from '@/components/space/MoreOptionsMenu/invite-members-modal-with-feedback';
import DialogModal from '@/components/shared/DialogModal/dialog-modal';
import { SpaceIconLogic } from '@/components/shared/space-icon';


/**
 * Styles to put into the sx properties of the Custom Card
 */
const styles = {
    root: {
        cursor: 'pointer',
        transition: '0.3s',
        position: 'relative',
        '&:hover': {
            transform: 'translateY(-4px)',
            '& $card': {
                boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.2)',
            },
        },
    },
    space_avatar: {
        width: 48,
        height: 48,
        borderRadius: '0.75rem',
        bgcolor: grey[500]
    },
    invite_button: {
        backdropFilter: 'blur(7px)',
        WebkitBackdropFilter: 'blur(7px)',
        bgcolor: 'rgba(82, 73, 245, 0.75)',
        border: '1px solid rgba(101, 93, 255, 0.47)',
        borderRadius: '16px',
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        color: '#ffffff',
        fontWeight: 600,
        padding: '5px 10px',
        transition: 'all 0.3s ease',
        '&:hover': {
            bgcolor: 'rgba(101, 93, 255, 0.9)',
            boxShadow: '0 8px 40px rgba(0, 0, 0, 0.15)',
        },
        '& > *': {
            textTransform: 'none !important',
        },
    },
};

interface CustomCardProps {
    space: SpaceDetailed;
    defaultDescription: React.ReactNode;
    children: React.ReactNode;
    membersOverview?: React.ReactNode;
}

export const CustomCard = ({
    space,
    defaultDescription,
    children,
    membersOverview
}: CustomCardProps) => {
    const router = useRouter();
    const maxDescLength: number = 77;
    const maxTitleLength: number = 54;

    return (
        <Box onClick={() => router.push(`/spaces/${space.id}`)} sx={styles.root}>
            <ContentCard >
                <Box display='flex' >
                    <Box py={2} pl={2} gap={1} display='flex' flexDirection='row'>
                        <Avatar sx={styles.space_avatar} variant={'rounded'} >
                            <SpaceIconLogic iconAlias={space.icon_alias} size={'xl'} />
                        </Avatar>
                        <Box alignSelf='center'>
                            {/* Note future: make this fonts responsive, use @media */}
                            <Typography fontWeight={700} >
                                {setMaxStringLength(space.name, maxTitleLength)}
                            </Typography>
                            <Typography component='div' fontSize={'0.8em'} fontWeight={400} color={'grey.600'}>
                                {/* TODO if this stays the "created by" make it clickable to the user creator profile */}
                                {space.creator != undefined ? 'Created by ' + space.creator.username : ''}
                            </Typography>
                        </Box>
                    </Box>
                    <Box  py={1} pr={0} onClick={(e) => e.stopPropagation()} sx={{ marginLeft: 'auto' }} >
                        <MoreOptionsMenu space={space} />
                    </Box>
                </Box>
                <Box
                    pb={1}
                    px={2}
                    color={'grey.600'}
                    fontSize={'0.9rem'}
                >
                    <Typography component='div' className={ubuntu.className} sx={{ pt: 1 }} >
                        {space.description ? (
                            setMaxStringLength(space.description, maxDescLength)
                        ) : (
                            <span>
                                {defaultDescription}
                            </span>
                        )}
                    </Typography>
                </Box>
                <Box p={2} gap={2} display='flex' alignSelf='stretch' flexDirection='row'>
                    {/* this is the avatars group server component that can be passed as props to this client component */}
                    <Box onClick={(e) => e.stopPropagation()} sx={{ overflow: 'hidden', flexShrink: 1 }}>
                        {children}
                    </Box>
                    {/* this is the invite members button */}
                    <Box alignSelf='center' marginLeft='auto' flexShrink={0} onClick={(e) => e.stopPropagation()}>
                        <DialogModal
                            button={
                                <Button
                                    sx={styles.invite_button}
                                    variant={'contained'}
                                    color={'secondary'}
                                >
                                    {'Invite Members +'}
                                </Button>
                            }
                            childrenTitle={'Invite Members'}
                            childrenBody={<InviteMembersModalWithFeedback spaceId={space.id}>{membersOverview}</InviteMembersModalWithFeedback>}
                        />
                    </Box>
                </Box>
            </ContentCard>
        </Box>
    );
};