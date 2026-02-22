'use client';
import React, { useState } from 'react';
import logo from '@/public/images/headers/avidhabits.png';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button, { ButtonPropsColorOverrides, ButtonPropsVariantOverrides } from '@mui/material/Button';
import { OverridableStringUnion } from '@mui/types';
import NextLink from 'next/link';
import Link from "@mui/material/Link";

import styles from './landing-navbar.module.css';
import { LandingNavbarSm } from './landing-navbar-sm';
import SideDrawer from '../SideDrawer/side-drawer';

/**
 * Defines the structure of a list of Buttons or Links 
 */
export interface LinkButtons {
    [key: string]: {
        name: string
        linkTo: string
        key?: string
        className?: string
        classNameSmallScreen?: string
        variant?: OverridableStringUnion<"contained" | "outlined" | "text", ButtonPropsVariantOverrides> | undefined
        color?: OverridableStringUnion<'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning', ButtonPropsColorOverrides>
    }
}

/**
 * Resposive landing page navigation menu (top menu / navbar) that the user first sees if he is not authenticated 
 * @returns landing page navigation menu
 */
const LandingNavbar: React.FC = () => {

    // Definition of NavBar pages and their links
    const navbarPages: LinkButtons = {
        contact: {
            name: 'Contact',
            linkTo: '/'
        },
        about: {
            name: 'About',
            linkTo: '/'
        }
    }

    // Action buttons definition
    const actionButtons: LinkButtons = {
        login: {
            name: 'Log in',
            linkTo: '/login',
            variant: 'outlined',
            color: 'inherit',
            className: styles['landing-header__action-buttons__item'],
        },
        signup: {
            name: 'Sign Up',
            linkTo: '/signup',
            variant: 'contained',
            color: 'secondary',
            key: 'signup',
            className: styles['landing-header__action-buttons__item'],
        }
    }

    // for small screens:
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <nav>
            {/* use sticky navigation on (Desktop view mainly) when home page gets bigger <AppBar position="sticky" */}
            <AppBar position="static" elevation={0} sx={{ p: 1 }} >
                <Container maxWidth="xl" >
                    <Toolbar>
                        {/*
                        The responsiveness of the elements can be handled by the display property, if xs: 'none' it means
                        the element is not shown on small screens, this way we can show or hide the blocks we need for each screen size.
                        we can further add rules for larger screen sizes if required (xs, sm, md, lg, xl...)
                        */}

                        {/*
                        Elements for medium (md) screens and above:
                        */}
                        <Link
                            sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, mr: 1 }}
                            component={NextLink}
                            href="/"
                        >
                            <img
                                src={logo.src ?? logo}
                                width={130}
                                alt="logo"
                                style={{ height: 'auto' }}
                            />
                        </Link>
                        <Box
                            sx={{ flexGrow: 1, gap: '20px', display: { xs: 'none', md: 'flex' } }}
                        >
                            {Object.entries(navbarPages).map(([key, page]) => (
                                <Button
                                    variant='text'
                                    className={styles['landing-header__menu__item']}
                                    component={NextLink}
                                    href={page.linkTo}
                                    key={key}
                                    sx={{ my: 2, color: 'white' }}
                                >
                                    {page.name}
                                </Button>
                            ))}
                        </Box>
                        <Box
                            sx={{ gap: '10px', display: { xs: 'none', md: 'flex' } }} >
                            {Object.entries(actionButtons).map(([key, button]) => (
                                <Button
                                    variant={button.variant}
                                    color={button.color}
                                    className={button.className}
                                    component={NextLink}
                                    href={button.linkTo}
                                    key={key}
                                >
                                    {button.name}
                                </Button>
                            ))}
                        </Box>
                        {/* Navigation bar content for small screens and below */}
                        <LandingNavbarSm handleDrawerToggle={handleDrawerToggle} actionButtons={actionButtons} />
                    </Toolbar>
                </Container>
            </AppBar>
            {/* Sidebar (Drawer) used for menu on small screens */}
            <SideDrawer
                mobileOpen={mobileOpen}
                actionButtons={actionButtons}
                navbarPages={navbarPages}
                handleDrawerToggle={handleDrawerToggle}
            >
                {/* Passed as children to the SideDrawer */}
                <Box
                    sx={{ p: 1, textAlign: 'center' }}
                >
                    {Object.entries(actionButtons).slice(0).reverse().map(([key, button]) => (
                        <Button
                            variant={button.variant}
                            color={button.color}
                            component={NextLink}
                            href={button.linkTo}
                            key={key}
                            sx={{ display: 'block', my: 1.5 }}
                            className={`${button.className} ${button.classNameSmallScreen}`}
                        >
                            {button.name}
                        </Button>
                    ))}
                </Box>
            </SideDrawer>
        </nav>
    );
}

export default LandingNavbar