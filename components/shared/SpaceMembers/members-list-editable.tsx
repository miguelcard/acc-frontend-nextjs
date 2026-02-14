'use client';
import React, { useState, useTransition } from 'react';
import { MemberT } from '@/lib/types-and-constants';
import { Box, List, ListItem, ListItemAvatar, ListItemText, Typography, IconButton, CircularProgress } from '@mui/material';
import { grey } from '@mui/material/colors';
import UserAvatar from '@/components/shared/UserAvatar/user-avatar';
import { removeUserFromSpace } from '@/lib/actions';
import { RemoveCircle } from '@mui/icons-material';
import { CustomSnackbar } from '@/components/shared/Snackbar/snackbar';

interface MembersListEditableProps {
    members: MemberT[];
    totalCount: number;
    spaceId: number;
}

/**
 * Client component that displays a list of members with the ability to remove them from the space.
 * Shows a remove icon next to each member that triggers the removal action when clicked.
 */
export function MembersListEditable({ members: initialMembers, totalCount, spaceId }: MembersListEditableProps) {
    const [members, setMembers] = useState<MemberT[]>(initialMembers);
    const [removingUserId, setRemovingUserId] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [openToast, setOpenToast] = useState<boolean>(false);

    const handleToastClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenToast(false);
    };

    const handleRemoveUser = async (userId: number) => {
        setRemovingUserId(userId);
        setErrorMessage(null);

        startTransition(async () => {
            const result = await removeUserFromSpace(spaceId, userId);

            if (result?.error) {
                setErrorMessage(result.error);
                setRemovingUserId(null);
                return;
            }

            // Remove the user from the local state
            setMembers((prev) => prev.filter((member) => member.id !== userId));
            setRemovingUserId(null);
            setOpenToast(true);
        });
    };

    if (!members.length) {
        return (
            <Box py={2}>
                <Typography variant="body2" color="text.secondary">
                    No members found in this space.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <CustomSnackbar
                isOpen={openToast}
                text="Member removed from space successfully."
                handleCloseToast={handleToastClose}
            />
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                Members ({members.length})
            </Typography>
            {errorMessage && (
                <Typography variant="body2" color="error" sx={{ py: 1 }}>
                    {errorMessage}
                </Typography>
            )}
            <List sx={{ width: '100%', bgcolor: 'background.paper', maxHeight: 300, overflow: 'auto' }}>
                {members.map((member: MemberT) => (
                    <ListItem
                        key={member.id}
                        alignItems="flex-start"
                        sx={{ px: 0, py: 0.5 }}
                        secondaryAction={
                            <IconButton
                                edge="end"
                                aria-label="remove member"
                                onClick={() => handleRemoveUser(member.id)}
                                disabled={removingUserId === member.id || isPending}
                                sx={{
                                    color: grey[500],
                                    '&:hover': {
                                        color: 'error.main',
                                    },
                                }}
                            >
                                {removingUserId === member.id ? (
                                    <CircularProgress size={20} color="inherit" />
                                ) : (
                                    <RemoveCircle fontSize='small' />
                                )}
                            </IconButton>
                        }
                    >
                        <ListItemAvatar>
                            <UserAvatar user={member} circleDiameter={40} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Typography component="span" variant="body1" fontWeight={500} display="block">
                                    {member.username}
                                </Typography>
                            }
                            secondary={
                                <Typography component="span" variant="body2" color="text.secondary" display="block">
                                    {member.name || ''}
                                </Typography>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
