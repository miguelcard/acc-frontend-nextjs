'use client';
import { FormikStep, FormikStepper } from '@/components/shared/FormikStepper/formik-stepper';
import Box from '@mui/material/Box';
import { Field, FormikValues } from 'formik';
import React, { useState } from 'react';
import { object, string } from 'yup';
import { UserT } from '@/lib/types-and-constants';
import { TextField as TextFieldFormikMui } from 'formik-mui';
import { patchUser } from '@/lib/actions';

interface Props {
    user: UserT;
    handleCloseDialog?: () => void;
}

/**
 * Component using the FormikStepper to edit the name of the user
 * @param user
 */
export function ChangeNameFormikStepper({ user, handleCloseDialog }: Props) {
    
    const [usersName, setUsersName] = useState<string | undefined>(user.name);

    /**
     * Submits the request to the server action which patches the user
     */
    async function submitEditUser(values: FormikValues) {
        
        const patchedUser = {
            name: values.name,
        };

        const updatedUser: UserT = await patchUser(patchedUser);

        if (updatedUser?.error) {
            // setErrorMessage(habit.error); // this would be to put an error in the UI, should I?
            console.log('error message: ', updatedUser.error);
            return;
        }
        setUsersName(updatedUser.name);

        if (handleCloseDialog !== undefined) {
            handleCloseDialog();
        }
    }

    return (
        <>
            <FormikStepper
                initialValues={{
                    name: usersName,
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
