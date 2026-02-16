'use client';
import React, { useState, useTransition, useEffect } from 'react';
import { MemberT } from '@/lib/types-and-constants';
import { Box, Chip, Dialog, DialogContent, DialogTitle, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Menu, MenuItem, Typography, IconButton } from '@mui/material';
import { grey } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';
import UserAvatar from '@/components/shared/UserAvatar/user-avatar';
import { removeUserFromSpace, updateSpaceRole } from '@/lib/actions';
import { RemoveCircle } from '@mui/icons-material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import RemoveModeratorIcon from '@mui/icons-material/RemoveModerator';
import { CustomSnackbar } from '@/components/shared/Snackbar/snackbar';
import { WarningConfirmationForm } from '@/components/shared/WarningConfirmationForm/warning-confirmation-form';

interface MembersListEditableProps {
    members: MemberT[];
    totalCount: number;
    spaceId: number;
    currentUserId?: number;
    isCurrentUserAdmin?: boolean;
}

/**
 * Client component that displays a list of members with the ability to remove them from the space.
 * Shows a remove icon next to each member that triggers the removal action when clicked.
 */
export function MembersListEditable({ members: initialMembers, totalCount, spaceId, currentUserId, isCurrentUserAdmin }: MembersListEditableProps) {
    const [members, setMembers] = useState<MemberT[]>(initialMembers);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [openToast, setOpenToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [menuMemberId, setMenuMemberId] = useState<number | null>(null);
    const [confirmRemoveMember, setConfirmRemoveMember] = useState<MemberT | null>(null);

    // Update local state when initialMembers prop changes (after server revalidation)
    useEffect(() => {
        setMembers(initialMembers);
    }, [initialMembers]);

    // Auto-close toast after 3 seconds
    useEffect(() => {
        if (openToast) {
            const timer = setTimeout(() => {
                setOpenToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [openToast]);

    const handleToastClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenToast(false);
    };

    const handleToggleAdmin = async (member: MemberT) => {
        if (!member.spacerole) return;
        setErrorMessage(null);

        const newRole = member.spacerole.role === 'admin' ? 'member' : 'admin';

        startTransition(async () => {
            const result = await updateSpaceRole(member.spacerole!.id, newRole, spaceId);

            if (result?.error) {
                setErrorMessage(result.error);
                return;
            }

            // Update the role in local state
            setMembers((prev) =>
                prev.map((m) =>
                    m.id === member.id
                        ? { ...m, spacerole: { ...m.spacerole!, role: newRole } }
                        : m
                )
            );
            setToastMessage(newRole === 'admin' ? 'User promoted to admin.' : 'Admin permissions removed.');
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
                text={toastMessage}
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
            <List sx={{ width: '100%', bgcolor: 'transparent', maxHeight: 300, overflow: 'auto' }}>
                {members.map((member: MemberT) => (
                    <ListItem
                        key={member.id}
                        alignItems="flex-start"
                        sx={{ px: 0, py: 0.5 }}
                        secondaryAction={
                            isCurrentUserAdmin && member.id !== currentUserId ? (
                                <>
                                    <IconButton
                                        edge="end"
                                        aria-label="member options"
                                        onClick={(e) => {
                                            setMenuAnchor(e.currentTarget);
                                            setMenuMemberId(member.id);
                                        }}
                                        disabled={isPending}
                                        sx={{ color: grey[500] }}
                                    >
                                        <MoreVertIcon fontSize='small' />
                                    </IconButton>
                                    <Menu
                                        anchorEl={menuAnchor}
                                        open={menuMemberId === member.id && Boolean(menuAnchor)}
                                        onClose={() => { setMenuAnchor(null); setMenuMemberId(null); }}
                                    >
                                        {member.spacerole && (
                                            <MenuItem
                                                onClick={() => {
                                                    setMenuAnchor(null);
                                                    setMenuMemberId(null);
                                                    handleToggleAdmin(member);
                                                }}
                                            >
                                                <ListItemIcon>
                                                    {member.spacerole.role === 'admin' ? (
                                                        <RemoveModeratorIcon fontSize='small' sx={{ color: grey[600] }} />
                                                    ) : (
                                                        <AddModeratorIcon fontSize='small' sx={{ color: grey[600] }} />
                                                    )}
                                                </ListItemIcon>
                                                <ListItemText>
                                                    {member.spacerole.role === 'admin' ? 'Remove admin' : 'Make admin'}
                                                </ListItemText>
                                            </MenuItem>
                                        )}
                                        <MenuItem
                                            onClick={() => {
                                                setMenuAnchor(null);
                                                setMenuMemberId(null);
                                                setConfirmRemoveMember(member);
                                            }}
                                            sx={{ color: 'error.main' }}
                                        >
                                            <ListItemIcon>
                                                <RemoveCircle fontSize='small' sx={{ color: 'error.main' }} />
                                            </ListItemIcon>
                                            <ListItemText>Remove user from group</ListItemText>
                                        </MenuItem>
                                    </Menu>
                                </>
                            ) : undefined
                        }
                    >
                        <ListItemAvatar>
                            <UserAvatar user={member} circleDiameter={40} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Typography component="span" variant="body1" fontWeight={500}>
                                        {member.username}
                                    </Typography>
                                    {member.spacerole && member.spacerole.role === 'admin' && (
                                        <Chip
                                            label="Admin"
                                            size="small"
                                            sx={{
                                                fontSize: '0.7rem',
                                                height: 20,
                                                bgcolor: 'rgba(82, 73, 245, 0.15)',
                                                color: 'rgba(82, 73, 245, 0.95)',
                                                fontWeight: 600,
                                            }}
                                        />
                                    )}
                                </Box>
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

            {/* Confirmation dialog for removing a member */}
            <Dialog
                open={confirmRemoveMember !== null}
                onClose={() => setConfirmRemoveMember(null)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle sx={{ m: 0, pt: 2 }} textAlign="center">
                    Remove Member
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => setConfirmRemoveMember(null)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent sx={{ px: 4 }}>
                    <WarningConfirmationForm
                        warningMessage={`Are you sure you want to remove ${confirmRemoveMember?.username ?? 'this user'} from the space? Their habits in this space will be deleted.`}
                        submitButtonText="Remove Member"
                        errorFallbackMessage="Unable to remove member, please try again later."
                        onConfirm={async () => {
                            if (!confirmRemoveMember) return;
                            const result = await removeUserFromSpace(spaceId, confirmRemoveMember.id);
                            if (result?.error) {
                                return { error: result.error };
                            }
                            setMembers((prev) => prev.filter((m) => m.id !== confirmRemoveMember.id));
                            setToastMessage('Member removed from space successfully.');
                            setOpenToast(true);
                        }}
                        handleCloseDialog={() => setConfirmRemoveMember(null)}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
}
