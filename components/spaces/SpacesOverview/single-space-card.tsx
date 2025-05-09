'use client';
import { ubuntu } from '@/styles/fonts/fonts';
import { Avatar, Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import React from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { stringIconMapper } from '@/lib/fa-icons-mapper';
import { grey } from '@mui/material/colors';
import { MoreOptionsMenu } from '@/components/space/MoreOptionsMenu/more-options-menu';
import { SpaceDetailed, SpaceT } from '@/lib/types-and-constants';
import { setMaxStringLength } from '@/lib/client-utils';
import ContentCard from '@/components/shared/ContentCard/content-card';


/**
 * Styles to put into the sx properties of the Custom Card
 */
const styles = {
    root: {
        cursor: 'pointer',
        // height: '100%',
        transition: '0.3s',
        position: 'relative',
        '&:before': {
            transition: '0.2s',
            position: 'absolute',
            width: '100%',
            height: '100%',
            content: '""',
            display: 'block',
            backgroundColor: '#d9daf1',
            borderRadius: '1rem',
            zIndex: 0,
            bottom: 0,
        },
        '&:hover': {
            '&:before': {
                bottom: -6,
            },
            '& $card': {
                boxShadow: '-12px 12px 64px 0 #bcc3d6',
            },
        },
    },
    logo: {
        width: 48,
        height: 48,
        borderRadius: '0.75rem',
        bgcolor: grey[500]
    },
    join: {
        background: 'linear-gradient(to top, #638ef0, #82e7fe)',
        borderRadius: 50,
        '& > *': {
            textTransform: 'none !important',
        },
    },
};

interface CustomCardProps {
    space: SpaceDetailed;
    defaultDescription: React.ReactNode;
    children: React.ReactNode;
}

export const CustomCard = ({
    space,
    defaultDescription,
    children
}: CustomCardProps) => {
    const router = useRouter();
    const maxDescLength: number = 77;
    const maxTitleLength: number = 54;

    return (
        <Box onClick={() => router.push(`/spaces/${space.id}`)} sx={styles.root}>
            <ContentCard >
                <Box display='flex' >
                    <Box py={2} pl={2} gap={1} display='flex' flexDirection='row'>
                        <Avatar sx={styles.logo} variant={'rounded'} >
                            <FontAwesomeIcon icon={stringIconMapper[space.icon_alias || 'rocket']} size='xl' />
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
                    <div onClick={(e) => e.stopPropagation()}>
                        {children}
                    </div>
                    <Box alignSelf='center' marginLeft='auto'>
                        <Button
                            sx={styles.join}
                            variant={'contained'}
                            color={'primary'}
                        >
                            {/* needed?? */}
                            {'Invite Members +'} 
                        </Button>
                    </Box>
                </Box>
            </ContentCard>
        </Box>
    );
};