'use client';
import { FormikStep, FormikStepper } from '@/components/shared/FormikStepper/formik-stepper';
import Box from '@mui/material/Box';
import { TextField as TextFieldFormikMui } from 'formik-mui';
import { Field, FormikValues } from 'formik';
import React, { useState } from 'react';
import { object, string } from 'yup';
import { SpaceT } from '@/lib/types-and-constants';
import Typography from '@mui/material/Typography';
import { usePatchSpace } from '@/lib/hooks/mutations';

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
    
    const [errorMessage, setErrorMessage] = useState<string>();
    const patchSpaceMutation = usePatchSpace(space.id);

    async function submitEditSpace(values: FormikValues, spaceId: number) {
        const updatedSpace: SpaceT = await patchSpaceMutation.mutateAsync({ formData: values, id: spaceId });
        if (updatedSpace?.error) {
            setErrorMessage("Unable to update the space name, please try again later.");
            console.log('error message: ', updatedSpace.error);
            return;
        }
        handleCloseDialog?.();
    }

    return (
        <>
            <FormikStepper
                initialValues={{
                    name: space.name,
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
