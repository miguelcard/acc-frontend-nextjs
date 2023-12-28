'use client';
import { FormikStep, FormikStepper } from '@/components/shared/FormikStepper/formik-stepper';
import Box from '@mui/material/Box';
import { TextField as TextFieldFormikMui } from 'formik-mui';
import { Field, FormikValues } from 'formik';
import React from 'react';
import { object, string } from 'yup';
import { createSpaceRole } from '@/lib/actions';
import { Space } from '@/lib/types-and-constants';


interface InviteMembersProps {
    space: Space;
    handleCloseDialog?: () => void;
    handleToastOpen: () => void;
}

/**
 * Component using the FormikStepper to add members/users to the space
 * @param space  
 * @returns 
 */
export function InviteMembers({ space, handleCloseDialog, handleToastOpen }: InviteMembersProps) {

    /**
     * Submits the request to the server action which adds the user to a space / creates a SpaceRole
     */
    async function submitAddUserToSpace(values: FormikValues, spaceId: number) {
        // add extra values that are required in the request
        values.space = spaceId;
        values.role = "member"; // harcoded for now

        const createdSpaceRole = await createSpaceRole(values, spaceId);

        if (createdSpaceRole?.error) {
            // setErrorMessage(createdSpaceRole.error); // this would be to put an error in the UI, necessary?
            // TODO: YES ITS NECESSARY TO PUT AN ERROR IN THE GUI
            console.log('error message: ', createdSpaceRole.error);
            return;
        }

        // Show a toast message if the user was added sucesfully
        handleToastOpen();

        if (handleCloseDialog !== undefined) {
            handleCloseDialog();
        };
    }

    return (
        <>
            <FormikStepper
                initialValues={{
                    member: '',
                }}
                onSubmit={async (values) => submitAddUserToSpace(values, space.id)}
                step={0}
                setStep={() => console.info("setStep is undefined")}
                submitButtonText='Invite'
            >

                {/* // TODO: add similar validation schema as when signing up the user to verify the email exists?? */}
                <FormikStep
                // validationSchema={object({
                //     name: string()
                //         .required('Space name is required'),
                // })}
                >
                    <Box paddingBottom={2}>
                        <Field fullWidth name="member" component={TextFieldFormikMui} label="username or email (PK for now)" variant='outlined' />
                    </Box>
                </FormikStep>
            </FormikStepper>
        </>
    )
}
