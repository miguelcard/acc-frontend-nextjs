import 'server-only';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import logoSecondary from '@/public/images/headers/avidhabits-secondary.png';
import Image from 'next/image';
import styles from './auth-navbar.module.css';


interface AuthNavBarProps {
    actionMessage?: string,
    buttonLinkTo?: string,
    buttonKey?: string,
    buttonText?: string,
}

export default function AuthNavbar(props: AuthNavBarProps) {
    return (
        <nav>
            {/* use sticky navigation on (Desktop view mainly) when home page gets bigger <AppBar position="sticky" */}
            <AppBar position="static" elevation={0} sx={{ p: 1 }} color='inherit' >
                <Container maxWidth="xl" >
                    <Toolbar>
                        <Link
                            sx={{ flexGrow: 1 }}
                            component={NextLink}
                            href="/"
                        >
                            <Image
                                src={logoSecondary}
                                width={130}
                                height={0}
                                alt="logo"
                            // sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' define something like this to improve future performance on images
                            />
                        </Link>
                        <Box
                            sx={{ display: { xs: 'flex', md: 'flex' }, my: 2, gap: '20px' }}
                        >
                            {props.actionMessage ? (
                                <Typography fontSize={'1em'} color={'secondary'} fontWeight={600} sx={{ my: 2 }}
                                    className={styles['responsive-action-text']}
                                >
                                    {props.actionMessage}
                                </Typography>
                            ) : (
                                null
                            )}

                            {(props.buttonKey && props.buttonLinkTo && props.buttonText) ? (
                                <Button
                                    className={styles['register-header__action-elements__button--primary']}
                                    variant='contained'
                                    color='secondary'
                                    component={NextLink}
                                    href={props.buttonLinkTo}
                                    key={props.buttonKey}
                                >
                                    {props.buttonText}
                                </Button>
                            ) : (
                                null
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </nav>
    )
}
