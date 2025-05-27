'use client';
import { FormikStep, FormikStepper } from '@/components/shared/FormikStepper/formik-stepper';
import Box from '@mui/material/Box';
import { TextField as TextFieldFormikMui } from 'formik-mui';
import { Field, FormikValues } from 'formik';
import React, { useState } from 'react';
import { object, string } from 'yup';
import { patchSpace } from '@/lib/actions';
import { SpaceT } from '@/lib/types-and-constants';
import Typography from '@mui/material/Typography';

interface EditSpaceTitleProps {
    space: SpaceT;
    handleCloseDialog?: () => void;
}

/**
 * Component using the FormikStepper to edit the space title
 * @param space
 * @returns
 */
export function EditSpaceTitle({ space, handleCloseDialog }: EditSpaceTitleProps) {
    
    const [spaceTitle, setSpaceTitle] = useState<string | undefined>(space.name);
    const [errorMessage, setErrorMessage] = useState<String>();

    /**
     * Submits the request to the server action which patches the space
     */
    async function submitEditSpace(values: FormikValues, spaceId: number) {
        const updatedSpace: SpaceT = await patchSpace(values, spaceId);
        if (updatedSpace?.error) {
            setErrorMessage("Unable to update the space name, please try again later.");
            console.log('error message: ', updatedSpace.error);
            return;
        }

        setSpaceTitle(updatedSpace.name);

        if (handleCloseDialog !== undefined) {
            handleCloseDialog();
        }
    }

    return (
        <>
            <FormikStepper
                initialValues={{
                    name: spaceTitle,
                }}
                onSubmit={async (values) => submitEditSpace(values, space.id)}
                step={0}
                setStep={() => { }}
            >
                <FormikStep
                    validationSchema={object({
                        name: string().max(32).required('Space name is required'),
                    })}
                >
                    <Box paddingBottom={2}>
                        <Field fullWidth name="name" component={TextFieldFormikMui} label="Space Name" variant="standard" />
                    </Box>
                    {errorMessage &&
                        <Typography width="100%" display="inline-flex" justifyContent="center" color="error.light">
                            {errorMessage}
                        </Typography>
                    }
                </FormikStep>
            </FormikStepper>
        </>
    );
}
