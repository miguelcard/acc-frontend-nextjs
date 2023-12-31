import React from 'react';
import { SignupFormProps } from './constants';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import styles from './signup.module.css';


export default function SignupSecondForm({ formik }: SignupFormProps) {
    return (
        <Container component="main" maxWidth="sm">
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
                <Typography component="h1" variant="h5" className={styles['register__action-text']}
                    sx={{ pb: 3 }}
                >
                    Choose your username
                </Typography>
                <Typography component="h6" variant="h6" className={styles['register__action-text--secondary']}
                    sx={{ pb: 4 }}
                >
                    Your username is how other community members will see you
                </Typography>
                <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    sx={{ mt: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                    style={{ width: 270 }}
                >
                    <TextField
                        sx={{ mb: 2, mt: 0.5 }}
                        style={{ width: 270 }}
                        type="text"
                        id="username"
                        name="username"
                        placeholder="username"
                        autoComplete='null'
                        spellCheck='false'
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        error={formik.touched.username && Boolean(formik.errors.username)}
                        helperText={formik.touched.username && formik.errors.username}
                        autoFocus
                    />
                    <Button
                        className={styles['auth__form-button']}
                        type='submit'
                        fullWidth
                        variant='contained'
                        sx={{ mt: 4 }}
                    >
                        Continue
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
