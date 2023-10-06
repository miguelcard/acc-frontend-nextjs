'use client';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import NextLink from 'next/link';
import { useState } from 'react';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';
import { login } from '@/lib/actions';
import styles from '../auth.module.css';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import secureLocalStorage from 'react-secure-storage';


export default function Login() {

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loginError, setLoginError] = useState<string>();

    /**
     * Submits the form login data to the backend API using server actions
     */
    async function handleFormAction(formData: FormData) {

        // this just returns the response body. No status or oder fields
        const res: NextResponse | any = await login(formData);

        // To improve, instead of doing this, see if you can return the whole request object from the 
        // server actions and check that the status was Ok
        if (res.authorization && res.authorization.token) {
            secureLocalStorage.setItem('token', res.authorization.token);
            redirect(`/home`);
        }

        if (Array.isArray(res)) {
            setLoginError(res[0]);
        } else {
            setLoginError('An unkown error ocurred');
            console.warn(loginError + ': ' + res);
        }
    }

    return (
        <Container component="section" maxWidth="xs">
            {/* CssBaseline porvides better css defaults from here*/}
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5" className={styles['auth__action-text']}
                    fontWeight='600'
                    sx={{ pb: 3 }}
                >
                    Welcome back!
                </Typography>
                <Box
                    component="form"
                    action={handleFormAction}
                    sx={{ mt: 1, boxSizing: 'border-box' }}>
                    <InputLabel htmlFor="email" sx={{ fontWeight: 'bold' }} >
                        Email
                    </InputLabel>
                    <TextField
                        sx={{ mb: 2, mt: 0.5 }}
                        type="email"
                        required
                        fullWidth
                        id="email"
                        name="email"
                        placeholder="sparrow@site.com"
                        autoComplete="email"
                        autoFocus
                    />
                    <InputLabel htmlFor="password" sx={{ fontWeight: 'bold' }}>
                        Password
                    </InputLabel>
                    <TextField
                        sx={{ mb: 2, mt: 0.5 }}
                        required
                        fullWidth
                        name="password"
                        type={showPassword ? "text" : "password"}
                        id="password"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password"
                                        edge="end"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <VisibilityOffIcon />
                                        ) : (
                                            <VisibilityIcon />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    {loginError ?
                         <Typography
                                width='100%'
                                display='inline-flex'
                                justifyContent='center'
                                color='error.light'
                                children={loginError}
                            />
                        : null}
                    <SubmitButton />
                    <Box
                        sx={{ fontSize: '0.8em', textAlign: 'center' }}
                    >
                        <Link href="#" variant="body2" component={NextLink} >
                            Forgot Password?
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    )
}

// The button is separated on its own component, otherwise the useFormStatus() hook does not work as expected (not sure why)
function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            className={styles['auth__form-button']}
            type="submit"
            fullWidth
            variant="contained"
            color='primary'
            sx={{ my: 3 }}
            disabled={pending}
        >
            {pending ? 'Logging in...' : 'Log In'}
        </Button>
    );
}