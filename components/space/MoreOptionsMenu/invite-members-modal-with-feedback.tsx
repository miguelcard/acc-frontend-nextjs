'use client';
import React, { useState, useEffect } from 'react';
import { InviteMembers } from './invite-members';
import { CustomSnackbar } from '@/components/shared/Snackbar/snackbar';

interface InviteMembersModalWithFeedbackProps {
    spaceId: number;
    children?: React.ReactNode;
}

/**
 * Client wrapper component for InviteMembers in modal context that provides success feedback
 * Shows a toast message when a member is successfully invited
 */
export function InviteMembersModalWithFeedback({ spaceId, children }: InviteMembersModalWithFeedbackProps) {
    const [openToast, setOpenToast] = useState<boolean>(false);

    const handleToastClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenToast(false);
    };

    const handleToastOpen = () => {
        setOpenToast(true);
    };

    // Auto-close toast after 4 seconds
    useEffect(() => {
        if (openToast) {
            const timer = setTimeout(() => {
                setOpenToast(false);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [openToast]);

    return (
        <>
            <InviteMembers
                spaceId={spaceId}
                handleToastOpen={handleToastOpen}
                children={children}
            />
            <CustomSnackbar
                isOpen={openToast}
                handleCloseToast={handleToastClose}
                text="Member invited successfully!"
            />
        </>
    );
}
