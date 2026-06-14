'use client';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { alpha } from '@mui/material/styles';
import { MemberT } from '@/lib/types-and-constants';
import { useMemberPublicStats } from '@/lib/hooks/queries';
import { XPCardContent } from '@/components/profile/XPCard/xp-card';
import UserAvatar from '@/components/shared/UserAvatar/user-avatar';

interface MemberProfileModalProps {
    member: MemberT | null;
    open: boolean;
    onClose: () => void;
}

export function MemberProfileModal({ member, open, onClose }: MemberProfileModalProps) {
    const { data: stats, isLoading, isError } = useMemberPublicStats(member?.id ?? null);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" scroll="paper">
            <DialogTitle sx={{ m: 0, pt: 2 }} textAlign="center">
                {member && (
                    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                        <UserAvatar user={member} circleDiameter={52} />
                        <Box textAlign="center">
                            <Typography fontWeight={700} fontSize="1rem" lineHeight={1.2}>
                                {member.username}
                            </Typography>
                            {member.name && (
                                <Typography fontSize="0.82rem" color="text.secondary">
                                    {member.name}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                )}
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent sx={{ px: 3, pb: 3 }}>
                {isLoading && (
                    <Box
                        sx={{
                            width: '100%',
                            borderRadius: 3,
                            p: 2.5,
                            bgcolor: (t) => alpha(t.palette.secondary.main, 0.06),
                            border: (t) => `1px solid ${alpha(t.palette.secondary.main, 0.18)}`,
                        }}
                    >
                        <Skeleton variant="text" width="50%" height={28} />
                        <Skeleton variant="rectangular" height={10} sx={{ my: 1.5, borderRadius: 5 }} />
                        <Skeleton variant="text" width="35%" height={20} />
                        <Skeleton variant="text" width="70%" sx={{ mt: 2 }} />
                    </Box>
                )}
                {isError && (
                    <Typography color="text.secondary" textAlign="center" fontSize="0.9rem" py={2}>
                        Could not load stats for this member.
                    </Typography>
                )}
                {stats && <XPCardContent stats={stats} />}
            </DialogContent>
        </Dialog>
    );
}
