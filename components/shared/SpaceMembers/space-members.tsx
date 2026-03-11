'use client';
import React, { useEffect, useState } from 'react';
import { MemberT, PaginatedResponse } from '@/lib/types-and-constants';
import AvatarGroup from '@mui/material/AvatarGroup';
import { Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { getUsersFromSpace, getUser } from '@/lib/fetch-functions';
import UserAvatar from '@/components/shared/UserAvatar/user-avatar';
import { MembersListEditable } from './members-list-editable';

/**
 * Group of avatars from users fetched from a specific space
 */
export function AvatarsGroup({ spaceId }: {spaceId: number}) {
    const maxAvatarsShown: number = 4;
    const [response, setResponse] = useState<PaginatedResponse<MemberT> | null>(null);

    useEffect(() => {
        getUsersFromSpace(spaceId, maxAvatarsShown).then(setResponse);
    }, [spaceId]);

    if (!response || response?.error) {
        return <></>;
    }

    return (
        <AvatarGroup
            max={maxAvatarsShown}
            total={response.count}
            sx={{
                avatar: {
                    fontSize: '0.875rem',
                    backgroundColor: '#6d7efc',
                },
                cursor: 'pointer',
            }}
        >
            {response.results.map((user: MemberT) => (

                <UserAvatar key={user.id} user={user} initialsFontSize='1.2rem' />
            ))}
        </AvatarGroup>
    );
}

/**
 * Detailed list of all members in a space showing avatar, username, and name.
 */
export function MembersList({ spaceId }: { spaceId: number }) {
    const maxMembersShown: number = 20;
    const [response, setResponse] = useState<PaginatedResponse<MemberT> | null>(null);

    useEffect(() => {
        getUsersFromSpace(spaceId, maxMembersShown).then(setResponse);
    }, [spaceId]);

    if (!response) {
        return <Box py={2} display="flex" justifyContent="center"><CircularProgress size={24} /></Box>;
    }

    if (response?.error || !response.results.length) {
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
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                Members ({response.count})
            </Typography>
            <List sx={{ width: '100%', bgcolor: 'background.paper', maxHeight: 300, overflow: 'auto' }}>
                {response.results.map((member: MemberT) => (
                    <ListItem key={member.id} alignItems="flex-start" sx={{ px: 0, py: 0.5 }}>
                        <ListItemAvatar>
                            <UserAvatar user={member} circleDiameter={40} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Typography component="span" variant="body1" fontWeight={500}>
                                    {member.username}
                                </Typography>
                            }
                            secondary={
                                <Typography component="span" variant="body2" color="text.secondary">
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

/**
 * Client component that fetches members and renders MembersListEditable with remove functionality.
 */
export function MembersListWithRemove({ spaceId }: { spaceId: number }) {
    const maxMembersShown: number = 20;
    const [response, setResponse] = useState<PaginatedResponse<MemberT> | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getUsersFromSpace(spaceId, maxMembersShown),
            getUser(),
        ]).then(([membersRes, userRes]) => {
            setResponse(membersRes);
            setCurrentUser(userRes?.error ? null : userRes);
            setLoading(false);
        });
    }, [spaceId]);

    if (loading) {
        return <Box py={2} display="flex" justifyContent="center"><CircularProgress size={24} /></Box>;
    }

    if (response?.error) {
        return (
            <Box py={2}>
                <Typography variant="body2" color="text.secondary">
                    Unable to load members.
                </Typography>
            </Box>
        );
    }

    const currentUserMember = response?.results.find((m: MemberT) => m.id === currentUser?.id);
    const isCurrentUserAdmin = currentUserMember?.spacerole?.role === 'admin';

    return (
        <MembersListEditable
            members={response?.results ?? []}
            totalCount={response?.count ?? 0}
            spaceId={spaceId}
            currentUserId={currentUser?.id}
            isCurrentUserAdmin={isCurrentUserAdmin}
        />
    );
}