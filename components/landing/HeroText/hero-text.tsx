'use client';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import NextLink from 'next/link';
import Typography from '@mui/material/Typography';
import styles from './hero-text.module.css';

export default function HeroText() {
    // variable that tells us if screen is smaller than 'sm', i.e. extra small, used to apply a different style when true
    const theme = useTheme();
    const isXsScreenOrBelow: boolean = useMediaQuery(
        theme.breakpoints.down('sm')
    );
    const isSmScreenOrBelow: boolean = useMediaQuery(
        theme.breakpoints.down('md')
    );

    // hero content text and get-started button
    return (
        <Box
            className={`${styles['hero__text-and-button-container']} ${isSmScreenOrBelow ? styles['hero__text-and-button-container--sm'] : ''}`}
        >
            <Box
                px={{ xs: 3, sm: 2}}
                className={`${styles['hero__text-container']} ${isXsScreenOrBelow ? styles['hero__text-container--xs'] : ''} `}
            >
                <Typography
                    className={`${styles['hero__primary-text']} ${isXsScreenOrBelow ? styles['hero__primary-text--xs'] : ''} `}
                >
                    Accountability
                    <br />
                    meets Partner.
                </Typography>
                <Typography className={styles['hero__secondary-text']}>
                    Improve your habits and achieve your goals
                    {isXsScreenOrBelow ? ' ' : <br />}
                    while sharing your journey with others.
                    {/* alternative: "Transform your habits, reach your goals, and thrive alongside others on a shared journey of growth." */}
                </Typography>
            </Box>
            <Box>
                <Button
                    color="secondary"
                    variant="contained"
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
