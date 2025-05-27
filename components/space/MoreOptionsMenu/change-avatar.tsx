'use client';
import { FormikStep, FormikStepper } from '@/components/shared/FormikStepper/formik-stepper';
import { Field, FormikValues } from 'formik';
import React, { useState } from 'react';
import { SpaceT } from '@/lib/types-and-constants';
import { patchSpace } from '@/lib/actions';
import { EmojiSelector } from '../EmojiSelector/emoji-selector';
import Typography from '@mui/material/Typography';

interface ChangeAvatarProps {
    space: SpaceT;
    handleCloseDialog?: () => void;
}

/**
 * Component using the FormikStepper to edit the avatar / emoji of the space
 * @param space
 * @returns
 */
export function ChangeAvatar({ space, handleCloseDialog }: ChangeAvatarProps) {

    const [errorMessage, setErrorMessage] = useState<string>();

    /**
     * Submits the request to the server action which patches the space
     */
    async function submitEditSpace(values: FormikValues, spaceId: number) {
        const updatedSpace: SpaceT = await patchSpace(values, spaceId);
        if (updatedSpace?.error) {
            setErrorMessage("Unable to update avatar. Please try again later."); // this would be to put an error in the UI, should I?
            console.log('error message: ', updatedSpace.error);
            return;
        }

        if (handleCloseDialog !== undefined) {
            handleCloseDialog();
        }
    }

    return (
        <>
            <FormikStepper
                initialValues={{
                    icon_alias: '',
                }}
                onSubmit={async (values) => submitEditSpace(values, space.id)}
                step={0}
                setStep={() => console.info('setStep is undefined')}
            >
                <FormikStep>
                    <EmojiSelector />
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