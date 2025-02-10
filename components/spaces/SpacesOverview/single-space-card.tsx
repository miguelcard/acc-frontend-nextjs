'use client';
import { ubuntu } from '@/styles/fonts/fonts';
import { Avatar, Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import React from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { stringIconMapper } from '@/lib/fa-icons-mapper';
import grey from '@mui/material/colors/grey';


/**
 * Styles to put into the sx properties of the Custom Card
 */
const styles = {
    root: {
        cursor: 'pointer',
        height: '100%',
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
    card: {
        zIndex: 1,
        position: 'relative',
        borderRadius: '1rem',
        boxShadow: '0 6px 20px 0 #dbdbe8',
        backgroundColor: '#fff',
        // backgroundColor: '#d9daf1',
        transition: '0.4s',
        height: '100%',
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
    spaceId: number;
    icon: string;
    title: string;
    subtitle: string;
    description: any;
    children: React.ReactNode;
}

export const CustomCard = ({
    spaceId,
    icon,
    title,
    subtitle,
    description,
    children
}: CustomCardProps) => {
    const router = useRouter();

    return (
        <Box onClick={() => router.push(`/spaces/${spaceId}`)} sx={styles.root}>
            <Box sx={styles.card} display='flex' flexDirection='column'>
                <Box p={2} gap={2} display='flex' flexDirection='row'>
                    <Avatar sx={styles.logo} variant={'rounded'} >
                        <FontAwesomeIcon icon={stringIconMapper[icon]} size='xl' />
                    </Avatar>
                    <Box alignSelf='center'>
                        {/* Note future: make this fonts responsive, use @media */}
                        <Typography fontWeight={700} >
                            {title}
                        </Typography>
                        <Typography component='div' fontSize={'0.8em'} fontWeight={400} color={'grey.600'}>
                            {/* TODO if this stays the "created by" make it clickable to the user creator profile */}
                            {subtitle}
                        </Typography>
                    </Box>
                </Box>
                <Box
                    pb={1}
                    px={2}
                    color={'grey.600'}
                    fontSize={'0.9rem'}
                >
                    <Typography component='div' className={ubuntu.className} sx={{pt:1}} >
                        {description}
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
                            {'Needed?'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};