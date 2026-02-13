'use client';
import React from 'react';
import Box from '@mui/material/Box';
import DialogModal from '@/components/shared/DialogModal/dialog-modal';

interface ClickableAvatarsGroupProps {
    /** The AvatarsGroup server component to display */
    children: React.ReactNode;
    /** The MembersList server component to show in the modal */
    membersOverview: React.ReactNode;
}

/**
 * Client wrapper that makes the AvatarsGroup clickable.
 * When clicked, opens a modal showing the full members list.
 */
export function ClickableAvatarsGroup({ children, membersOverview }: ClickableAvatarsGroupProps) {
    return (
        <DialogModal
            button={
                <Box
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                            opacity: 0.8,
                        },
                    }}
                >
                    {children}
                </Box>
            }
            childrenTitle="Space Members"
            childrenBody={membersOverview}
        />
    );
}
