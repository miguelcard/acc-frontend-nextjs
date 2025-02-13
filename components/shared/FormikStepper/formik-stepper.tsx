'use client';
import Box from '@mui/material/Box';
import Button, { ButtonPropsColorOverrides } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Form, Formik, FormikConfig, FormikTouched, FormikValues, setNestedObjectValues } from 'formik';
import React, { ReactNode, useState } from 'react';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import IconButton from '@mui/material/IconButton';
import { OverridableStringUnion } from '@mui/types';

interface FormikStepProps extends Pick<FormikConfig<FormikValues>, 'children' | 'validationSchema'> {
    // Only allow React.ReactNode, not a function
    children: React.ReactNode;
}

export function FormikStep({ children }: FormikStepProps) {
    return <>{children}</>;
}

interface FormikStepperProps extends FormikConfig<FormikValues> {
    step: number;
    setStep: (step: any) => void;
    submitButtonText?: string;
    buttonColorVariant?: OverridableStringUnion< 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning', ButtonPropsColorOverrides>;
    buttonShade?: 'light' | 'main' | 'dark' | 'contrastText';
}

export function FormikStepper({ children, step, setStep, submitButtonText, buttonColorVariant = 'info', buttonShade = 'main', ...props }: FormikStepperProps) {
    const childrenArray = React.Children.toArray(children as ReactNode) as React.ReactElement<FormikStepProps>[];
    const currentChild = childrenArray[step];
    const [completed, setCompleted] = useState(false);
    const lastStepButtonText: string = submitButtonText === undefined ? "Save" : submitButtonText;

    function isLastStep() {
        return step === childrenArray.length - 1;
    }

    return (
        <Formik
            enableReinitialize
            {...props}
            validationSchema={currentChild?.props.validationSchema}
            onSubmit={async (values, helpers) => {

                if (isLastStep()) {
                    await props.onSubmit(values, helpers);
                    setCompleted(true);
                    setStep(0);
                    helpers.resetForm();
                } else {
                    setStep((s: number) => s + 1);
                    helpers.setTouched({});
                }
            }}
        >
            {({ isSubmitting, validateForm, setTouched }) => (
                <Form autoComplete="off">
                    {currentChild}
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        color={buttonColorVariant}
                        startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                        disabled={isSubmitting}
                        sx={{
                            my: 3,
                            padding: '8px 14px',
                            backgroundColor: (theme) => theme.palette[buttonColorVariant][buttonShade],
                            fontSize: '1.1em',
                        }}
                    >
                        {isSubmitting ? 'Submitting' : isLastStep() ? lastStepButtonText : 'Next'}
                    </Button>

                    {/* Stepper Dots to navigate to different pages of the form */}
                    {childrenArray.length > 1 &&
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                        >
                            {childrenArray.map((child, index) => (
                                <IconButton
                                    disabled={isSubmitting}
                                    key={index}
                                    onClick={async () => {
                                        const validationErrors = await validateForm();
                                        if (Object.keys(validationErrors).length > 0) {
                                            setTouched(setNestedObjectValues<FormikTouched<FormikValues>>(validationErrors, true));
                                            return;
                                        }
                                        // TODO:here you still have to do the check for the in between steps if you skip steps with validation ruels
                                        setStep(index);
                                        setTouched({});
                                    }}
                                >
                                    <FiberManualRecordIcon
                                        sx={{ fontSize: '0.6em' }}
                                        color={step === index ? 'inherit' : 'disabled'}
                                    />
                                </IconButton>
                            ))}
                        </Box>
                    }
                </Form>
            )}
        </Formik>
    );
}