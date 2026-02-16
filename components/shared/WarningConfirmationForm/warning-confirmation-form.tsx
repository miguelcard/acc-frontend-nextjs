'use client';
import { FormikStep, FormikStepper } from '@/components/shared/FormikStepper/formik-stepper';
import Box from '@mui/material/Box';
import React, { useState } from 'react';
import { Typography } from '@mui/material';
import Image from 'next/image';
import leaveSpaceWarningSvg from '@/public/images/spaces/leave-space-warning.svg';

interface WarningConfirmationFormProps {
    warningMessage: string;
    submitButtonText: string;
    onConfirm: () => Promise<{ error?: string } | void>;
    errorFallbackMessage?: string;
    handleCloseDialog?: () => void;
}

/**
 * Reusable warning confirmation form with a warning image and a confirm button.
 * Used for destructive actions like leaving a space or removing a member.
 */
export function WarningConfirmationForm({
    warningMessage,
    submitButtonText,
    onConfirm,
    errorFallbackMessage = 'Something went wrong, please try again later.',
    handleCloseDialog,
}: WarningConfirmationFormProps) {
    const [errorMessage, setErrorMessage] = useState<string>();

    async function handleSubmit() {
        const response = await onConfirm();

        if (response?.error) {
            setErrorMessage(errorFallbackMessage);
            console.log('WarningConfirmationForm error: ', response.error);
            return;
        }

        if (handleCloseDialog) {
            handleCloseDialog();
        }
    }

    return (
        <FormikStepper
            initialValues={{}}
            onSubmit={handleSubmit}
            step={0}
            setStep={() => {}}
            submitButtonText={submitButtonText}
            buttonColorVariant="error"
        >
            <FormikStep>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                    paddingBottom={2}
                >
                    <Box>
                        <Image src={leaveSpaceWarningSvg} width={150} alt="warning" />
                    </Box>
                    {errorMessage ? (
                        <Typography width="100%" display="inline-flex" justifyContent="center" color="error.light">
                            {errorMessage}
                        </Typography>
                    ) : (
                        <Typography color="error" fontSize="0.9em" align="left">
                            {warningMessage}
                        </Typography>
                    )}
                </Box>
            </FormikStep>
        </FormikStepper>
    );
}
