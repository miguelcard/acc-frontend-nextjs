'use client'
import React from 'react'
import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import NextLink from 'next/link';
import Typography from '@mui/material/Typography';
import styles from './hero-text.module.css';

export default function HeroText() {

    // variable that tells us if screen is smaller than 'sm', i.e. extra small, used to apply a different style when true
    const theme = useTheme();
    const isXsScreenOrBelow: boolean = useMediaQuery(theme.breakpoints.down("sm"));
    const isSmScreenOrBelow: boolean = useMediaQuery(theme.breakpoints.down("md"));

    // hero content text and get-started button
    return (
        <Box
            className={`${styles['hero__text-and-button-container']} ${isSmScreenOrBelow ? styles['hero__text-and-button-container--sm'] : ''}`}
        >
            <Box className={`${styles['hero__text-container']} ${isXsScreenOrBelow ? styles['hero__text-container--xs'] : ''} `} >

                <Typography
                    className={`${styles['hero__primary-text']} ${isXsScreenOrBelow ? styles['hero__primary-text--xs'] : ''} `}
                >
                    Accountability<br />
                    meets Partner.
                </Typography>
                <Typography
                    className={styles['hero__secondary-text']}
                >
                    Improve your habits and achieve your goals,{isXsScreenOrBelow ? ' ' : <br />}
                    while taking your journey along with others.
                </Typography>
            </Box>
            <Box>
                <Button
                    color='secondary'
                    variant='contained'
                    className={styles['hero__primary-button']}
                    component={NextLink}
                    href={'/signup'}
                    key={'signup'}
                >
                    Get Started
                </Button>
            </Box>
        </Box>
    );
}
