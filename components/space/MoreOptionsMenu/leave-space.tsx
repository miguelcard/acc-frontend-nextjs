'use client';
import { FormikStep, FormikStepper } from '@/components/shared/FormikStepper/formik-stepper';
import Box from '@mui/material/Box';
import React, { useState } from 'react';
import { deleteSpaceRole } from '@/lib/actions';
import { SpaceT } from '@/lib/types-and-constants';
import { Typography } from '@mui/material';
import Image from 'next/image';
import leaveSpaceWarningSvg from '@/public/images/spaces/leave-space-warning.svg';
import { useRouter } from 'next/navigation';

interface EditSpaceTitleProps {
    space: SpaceT;
    handleCloseDialog?: () => void;
    handleToastOpen: () => void;
}

/**
 * Component using the FormikStepper leave a space
 * Unlinks a user from a space by deleting the space role associated with 
 * it also changes the user role to another user, if the one leaving was the creator of the space
 * unlinks all habits from that user in that space (but the habits are not deleted)
 * deletes space IF the space has no more members in it
 * @param space
 * @returns
 */
export function LeaveSpace({ space, handleCloseDialog, handleToastOpen }: EditSpaceTitleProps) {
    
    const [errorMessage, setErrorMessage] = useState<string>();
    const router = useRouter();

    /**
     * Submits the request to the server action which deletes the space role
     */
    async function submitDeleteOwnSpaceRole(spaceId: number) {

        const response = await deleteSpaceRole(spaceId);

        if (response?.error) {
            setErrorMessage('Unable to leave space, please try again later.');
            console.log('error while leaving space / deleting spacerole: ', response.error);
            return;
        }

        if (handleCloseDialog !== undefined) {
            handleCloseDialog();
        }

        router.push(`/spaces`);
    }

    return (
        <>
            <FormikStepper
                initialValues={{
                }}
                onSubmit={async (values) => submitDeleteOwnSpaceRole(space.id)}
                step={0}
                setStep={() => {}}
                submitButtonText="Leave Space"
                buttonColorVariant='error'
            >
                <FormikStep>
                    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column"
                        paddingBottom={2}
                    >
                        <Box>
                            <Image src={leaveSpaceWarningSvg} width={150} alt="habit" />
                        </Box>
                        {errorMessage ? (
                            <Typography width="100%" display="inline-flex" justifyContent="center" color="error.light">
                                {errorMessage}
                            </Typography>
                        ) :
                            <Typography color={'error'} fontSize={'0.9em'} align='left' >
                                Leaving this space will delete your habits and revoke your access from the space.
                            </Typography>}
                    </Box>
                </FormikStep>
            </FormikStepper>
        </>
    );
}
