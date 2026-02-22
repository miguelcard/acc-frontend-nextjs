import Link from '@mui/material/Link';
import * as React from 'react';
import NextLink from 'next/link';

import logo from '@/public/images/headers/avidhabits.png';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import styles from './landing-navbar.module.css';
import { LinkButtons } from './landing-navbar';


interface LandingNavbarSmProps {
    handleDrawerToggle: () => void;
    actionButtons: LinkButtons;
}

/**
 * Landing Navigation bar content for small screens and below
 * @param props 
 */
export function LandingNavbarSm({ handleDrawerToggle, actionButtons }: LandingNavbarSmProps) {
    return (
        <>
            <Link
                sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
                component={NextLink}
                href="/"
            >
                <img
                    src={logo.src ?? logo}
                    width={115}
                    alt="logo"
                    style={{ height: 'auto' }}
                />
            </Link>

            {/* These are just the responsive buttons on the right side of the Navbar */}
            <Box sx={{ mr: 1, display: { xs: 'flex', md: 'none' } }}>
                <Button
                    variant='contained'
                    color='secondary'
                    className={styles['landing-header__action-buttons__item']}
                    component={NextLink}
                    href={actionButtons.signup.linkTo}
                    key={actionButtons.signup.key}
                    sx={{ display: { xs: 'none', sm: 'block' }, mr: 3, }}
                >
                    Get Started
                </Button>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                >
                    <MenuIcon />
                </IconButton>
            </Box>
        </>
    );
}
