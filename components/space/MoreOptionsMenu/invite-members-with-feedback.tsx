'use client';
import React, { useState, useEffect } from 'react';
import { InviteMembers } from './invite-members';
import { CustomSnackbar } from '@/components/shared/Snackbar/snackbar';

interface InviteMembersWithFeedbackProps {
    spaceId: number;
}

/**
 * Client wrapper component for InviteMembers that provides success feedback.
 * React Query handles cache invalidation — no need for router.refresh().
 */
export function InviteMembersWithFeedback({ spaceId }: InviteMembersWithFeedbackProps) {
    const [openToast, setOpenToast] = useState<boolean>(false);

    // Auto-close toast after 4 seconds
    useEffect(() => {
        if (openToast) {
            const timer = setTimeout(() => {
                setOpenToast(false);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [openToast]);

    const handleToastClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenToast(false);
    };

    const handleToastOpen = () => {
        setOpenToast(true);
    };

    return (
        <>
            <InviteMembers
                spaceId={spaceId}
                handleToastOpen={handleToastOpen}
            />
            <CustomSnackbar
                isOpen={openToast}
                handleCloseToast={handleToastClose}
                text="Member invited successfully!"
            />
        </>
    );
}