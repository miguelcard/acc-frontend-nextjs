'use client';
import { useState } from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

/** Password input with an eye button to show/hide what is being typed. */
export function PasswordField(props: Omit<TextFieldProps, 'type'>) {
    const [visible, setVisible] = useState(false);

    return (
        <TextField
            {...props}
            type={visible ? 'text' : 'password'}
            slotProps={{
                ...props.slotProps,
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label={visible ? 'Hide password' : 'Show password'}
                                onClick={() => setVisible((v) => !v)}
                                // keep focus in the input when tapping the eye (keyboard stays open on mobile)
                                onMouseDown={(e) => e.preventDefault()}
                                edge="end"
                            >
                                {visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                        </InputAdornment>
                    ),
                },
            }}
        />
    );
}
