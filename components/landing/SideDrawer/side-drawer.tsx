import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import React from 'react';
import logoSecondary from '@/public/images/headers/avidhabits-secondary.png';
import Link from "@mui/material/Link";

import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import NextLink from 'next/link';
import styles from './side-drawer.module.css';
import { LinkButtons } from '@/components/landing/LandingNavbar/landing-navbar';


interface SideDrawerProps {
    mobileOpen: boolean;
    handleDrawerToggle: () => void;
    navbarPages: LinkButtons;
    actionButtons: LinkButtons;
    children: React.ReactNode;
}

/**
 * Sidebar (Drawer) used for menu on small screens
 */
export default function SideDrawer({ mobileOpen, handleDrawerToggle, navbarPages, actionButtons, children }: SideDrawerProps) {

    return (
        <Box component="nav">
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                anchor="right"
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'flex', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: '370px',
                        // below means that until 600px, which is xs size, then fill drawer to 100% widths
                        ['@media (max-width:600px)']: {
                            width: '100%',
                        }
                    },
                }}
            >
                <Box onClick={handleDrawerToggle} sx={{ textAlign: 'left' }}>
                    <Box sx={{ p: 2, my: 2, style: 'inline-block' }}>
                        <Link
                            component={NextLink}
                            href="/"
                        >
                            <img
                                src={logoSecondary.src ?? logoSecondary}
                                width={120}
                                alt="logo"
                                style={{ height: 'auto' }}
                            />
                        </Link>
                        <IconButton
                            sx={{ float: 'right' }}
                            onClick={handleDrawerToggle}>
                            <CloseRoundedIcon />
                        </IconButton>
                    </Box>
                    <List>
                        {Object.entries(navbarPages).map(([key, page]) => (
                            <ListItem key={key} disablePadding >
                                <ListItemButton
                                    key={key}
                                    sx={{ textAlign: 'left' }}
                                    component={NextLink}
                                    href={page.linkTo}
                                >
                                    <ListItemText
                                        key={key}
                                        disableTypography={true}
                                        className={styles['sidebar__menu__item']}
                                        primary={page.name}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    {children}
                </Box>
            </Drawer>
        </Box>
    )
}
