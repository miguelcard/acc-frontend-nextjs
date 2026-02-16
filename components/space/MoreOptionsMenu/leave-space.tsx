'use client';
import React from 'react';
import { deleteSpaceRole } from '@/lib/actions';
import { SpaceT } from '@/lib/types-and-constants';
import { useRouter } from 'next/navigation';
import { WarningConfirmationForm } from '@/components/shared/WarningConfirmationForm/warning-confirmation-form';

interface EditSpaceTitleProps {
    space: SpaceT;
    handleCloseDialog?: () => void;
}

/**
 * Component using the WarningConfirmationForm to leave a space
 * Unlinks a user from a space by deleting the space role associated with 
 * it also changes the user role to another user, if the one leaving was the creator of the space
 * unlinks all habits from that user in that space (but the habits are not deleted)
 * deletes space IF the space has no more members in it
 * @param space
 * @returns
 */
export function LeaveSpace({ space, handleCloseDialog }: EditSpaceTitleProps) {
    const router = useRouter();

    async function handleConfirm() {
        const response = await deleteSpaceRole(space.id);

        if (response?.error) {
            return { error: response.error };
        }

        router.push(`/spaces`);
    }

    return (
        <WarningConfirmationForm
            warningMessage="Leaving this space will delete your habits and revoke your access from the space."
            submitButtonText="Leave Space"
            onConfirm={handleConfirm}
            errorFallbackMessage="Unable to leave space, please try again later."
            handleCloseDialog={handleCloseDialog}
        />
    );
}
