'use client';
import { FormikStep, FormikStepper } from '@/components/shared/FormikStepper/formik-stepper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Field, FormikValues } from 'formik';
import React, { useState } from 'react'
import { object, string } from 'yup';
import { patchSpace } from '@/lib/actions';
import { SpaceT } from '@/lib/types-and-constants';
import Typography from '@mui/material/Typography';



interface EditSpaceDescriptionProps {
    space: SpaceT;
    handleCloseDialog?: () => void;
}

/**
 * Component using the FormikStepper to edit the description of the space
 * @param space  
 * @returns 
 */
export function EditSpaceDescription({ space, handleCloseDialog }: EditSpaceDescriptionProps) {

    const [spaceDescripton, setSpaceDescripton] = useState<string | undefined>(space.description);
    const [errorMessage, setErrorMessage] = useState<string>();

    /**
     * Submits the request to the server action which patches the space
     */
    async function submitEditSpace(values: FormikValues, spaceId: number) {
        const updatedSpace: SpaceT = await patchSpace(values, spaceId);
        if (updatedSpace?.error) {
            setErrorMessage("Unable to update the space description. Please try again later."); // this would be to put an error in the UI, should I?
            console.log('error message: ', updatedSpace.error);
            return;
        }
        setSpaceDescripton(updatedSpace.description);
        if(handleCloseDialog !== undefined){handleCloseDialog()};
    }

    return (
        <>
            <FormikStepper
                initialValues={{
                    description: spaceDescripton,
                }}
                onSubmit={async (values) => submitEditSpace(values, space.id)}
                step={0}
                setStep={() => console.info("setStep is undefined")}
            >

                <FormikStep
                    validationSchema={object({
                        description: string()
                            .max(220, 'A maximum of 220 characters is allowed'),
                    })}
                >
                    <Box paddingBottom={2}>
                        {/* for this field the normal MUI TextField is used in order to allow validation on change, which was not supported out of the box from the formik-mui library */}
                        <Field name="description">
                            {({ field, form, meta }: any) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    type="text"
                                    name="description"
                                    label="Edit Space Description"
                                    // placeholder="Enter the space description"
                                    autoComplete='null'
                                    spellCheck='false'
                                    onFocus={() => form.setFieldTouched(field.name, true)}
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    error={meta.touched && Boolean(meta.error)}
                                    helperText={meta.touched && meta.error}
                                    multiline maxRows={6}
                                />
                            )}
                        </Field>
                    </Box>
                    {errorMessage &&
                        <Typography width="100%" display="inline-flex" justifyContent="center" color="error.light">
                            {errorMessage}
                        </Typography>
                    }
                </FormikStep>
            </FormikStepper>
        </>
    )
}
