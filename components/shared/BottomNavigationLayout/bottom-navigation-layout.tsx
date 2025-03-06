'use client'
import { faEarthEurope, faRocket, faStar, faUserAstronaut } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography } from '@mui/material';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import NextLink from 'next/link';
import React from 'react';


export const BottomNavigationLayout = ({ children }: { children: React.ReactNode }) => {

    const [value, setValue] = React.useState<number | null>(0);

    return (
        /* a ref is used to scroll back to the top whenever the value changes (useRef hook + useEffect hook= DO AT THE END IF NEEDED*/
        <Box sx={{ pb: 11 }} >
            <CssBaseline />

            {/* TODO: can I add this children from the layout.tsx and not having to pass them as children here? */}
            {children}

            <Paper
                sx={{ position: 'fixed', bottom: -2, left: 0, right: 0 , zIndex: 1200 }}
                elevation={4}
            >
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                    sx={{
                        '& .MuiBottomNavigationAction-root': {
                          color: 'grey.400', // Unselected icon color
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
                        href={'/spaces'}
                        key={'spaces'}
                    
                    />
                    <BottomNavigationAction
                        label={<NavigationText text='Favourite'/>}
                        icon={<FontAwesomeIcon icon={faStar} />}
                        component={NextLink}
                        href={'/spaces/1'}
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
