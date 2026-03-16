'use client';
import React from 'react';
import TextField from '@mui/material/TextField';
import { FormikContextType, FormikValues, useFormikContext } from 'formik';

/**
 * Extracted component so that useFormikContext is called at the top level
 * of a React component (not inside a callback like renderInput).
 */
export function FormikAutocompleteInput({ params }: { params: any }) {
    const { errors, setFieldValue }: FormikContextType<FormikValues> = useFormikContext();

    const keyProp = `${params.InputLabelProps.htmlFor}-${params.id}`;
    const { InputLabelProps, id, ...inputProps } = params;

    return (
        <TextField
            name="input"
            key={keyProp}
            {...inputProps}
            label="Username or Email"
            error={Boolean(errors.username_email)}
            helperText={errors.username_email || ''}
            onBlur={() => setFieldValue('username_email', inputProps.inputProps.value)}
        />
    );
}
