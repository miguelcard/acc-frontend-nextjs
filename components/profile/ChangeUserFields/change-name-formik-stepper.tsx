'use client';
import { FormikStep, FormikStepper } from '@/components/shared/FormikStepper/formik-stepper';
import Box from '@mui/material/Box';
import { Field, FormikValues } from 'formik';
import React from 'react';
import { object, string } from 'yup';
import { UserT } from '@/lib/types-and-constants';
import { TextField as TextFieldFormikMui } from 'formik-mui';
import { usePatchUser } from '@/lib/hooks/mutations';

interface Props {
    user: UserT;
    handleCloseDialog?: () => void;
}

/**
 * Component using the FormikStepper to edit the name of the user
 * @param user
 */
export function ChangeNameFormikStepper({ user, handleCloseDialog }: Props) {
    
    const patchUserMutation = usePatchUser();

    async function submitEditUser(values: FormikValues) {
        
        const patchedUser = {
            name: values.name,
        };

        const updatedUser: UserT = await patchUserMutation.mutateAsync(patchedUser);

        if (updatedUser?.error) {
            console.log('error message: ', updatedUser.error);
            return;
        }
        handleCloseDialog?.();
    }

    return (
        <>
            <FormikStepper
                initialValues={{
                    name: user.name ?? '',
                }}
                onSubmit={async (values) => submitEditUser(values)}
                step={0}
                setStep={() => { }}
            >
                <FormikStep
                    validationSchema={object({
                        name: string().max(40),
                    })}
                >
                    <Box paddingBottom={2}>
                        <Field fullWidth name="name" component={TextFieldFormikMui} label="Your Name" variant="standard" />
                    </Box>
                </FormikStep>
            </FormikStepper>
        </>
    );
}
