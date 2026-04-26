'use client'
import { faEarthEurope, faRocket, faUserAstronaut, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography } from '@mui/material';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import { Capacitor } from '@capacitor/core';
import { useQueryClient } from '@tanstack/react-query';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import PullToRefresh from 'react-simple-pull-to-refresh';

const isNative = Capacitor.isNativePlatform();

export const BottomNavigationLayout = ({ children }: { children: React.ReactNode }) => {

    const pathname: string  = usePathname();
    const queryClient = useQueryClient();

    const handleRefresh = async (): Promise<void> => {
        await queryClient.invalidateQueries();
    };

    const getPathValue = () => {
        if (pathname === '/' || pathname.startsWith('/spaces')) return 0;
        if (pathname.startsWith('/all-habits')) return 1;
        if (pathname.startsWith('/profile')) return 2;
        return 0;
    }

    return (
        /* a ref is used to scroll back to the top whenever the value changes (useRef hook + useEffect hook= DO AT THE END IF NEEDED*/
        <Box sx={{ 
            // Account for the fixed bottom nav height (56px) + device home bar inset (halved)
            pb: 'calc(56px + var(--safe-area-inset-bottom) / 2)',
            // Add safe area padding for devices with notches/status bars
            pt: 'var(--safe-area-inset-top)',
        }} >
            <CssBaseline />

            {/* TODO: can I add this children from the layout.tsx and not having to pass them as children here? */}
            {isNative ? (
                <PullToRefresh
                    onRefresh={handleRefresh}
                    // pullingContent={<p style={{ textAlign: 'center', margin: 0 }}>Pull to refresh</p>}
                >
                    <>{children}</>
                </PullToRefresh>
            ) : (
                children
            )}
            <Paper
                sx={{ 
                    position: 'fixed', 
                    bottom: 0, 
                    left: 0, 
                    right: 0,
                    // Add safe area padding for devices with home bars (e.g., iPhone X+).
                    // Using half the inset: the gesture area is transparent so a small
                    // overlap is fine, and it avoids the nav feeling excessively tall.
                    pb: 'calc(var(--safe-area-inset-bottom) / 2)',
                    zIndex: 1200,
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    bgcolor: 'rgba(255, 255, 255, 0.25)',
                    border: '1.5px solid rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                 }}
                elevation={0}
            >
                <BottomNavigation
                    showLabels
                    value={getPathValue()}
                    sx={{
                        bgcolor: 'transparent',
                        '& .MuiBottomNavigationAction-root': {
                          color: 'grey.600', // Unselected icon color
                        },
                        '& .Mui-selected, & .Mui-selected > svg': {
                          color: 'black', // Selected icon and label color
                        },
                        '& .MuiBottomNavigationAction-root > svg': {
                            fontSize: 18, // Set your desired icon size here
                        },
                    }}
                >
                    <BottomNavigationAction
                        label={<NavigationText text='Spaces'/>}
                        icon={<FontAwesomeIcon icon={faRocket} />}
                        component={NextLink}
                        href={'/'}
                        key={'spaces'}
                    
                    />
                    <BottomNavigationAction
                        label={<NavigationText text='All my Habits'/>}
                        icon={<FontAwesomeIcon icon={faCheckDouble} />}
                        component={NextLink}
                        href={'/all-habits'}
                        key={'favorite'}
                    />
                    {/* <BottomNavigationAction
                        label="Explore/Discover/Topics/Threads"
                        icon={<FontAwesomeIcon icon={faEarthEurope or vinoculars or lupe or compass} />}
                        disabled
                        place to explore groups and threads? (future gropus or public spaces that you could join??)
                    /> */}
                    {/* <BottomNavigationAction
                        label="All Habits Overview"
                        icon={<FontAwesomeIcon icon={?} />}
                        disabled
                        place to show an overview of all the habits and how the user is doing?...

                        ...or completion calendar
                    /> */}
                    <BottomNavigationAction
                        label={<NavigationText text='Profile'/>}
                        icon={<FontAwesomeIcon icon={faUserAstronaut} />}
                        component={NextLink}
                        href={'/profile'}
                        key={'profile'}
                    />
                </BottomNavigation>
            </Paper>
        </Box>
    )
}

// Return a styled text for each menu item
const NavigationText = ({ text }: { text: string }) => {
    return (
        <Typography
            fontSize={'0.9em'}
        >
            {text}
        </Typography>
    )
}
