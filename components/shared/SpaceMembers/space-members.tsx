import 'server-only';
import React from 'react';
import { MemberT, PaginatedResponse } from '@/lib/types-and-constants';
import AvatarGroup from '@mui/material/AvatarGroup';
import { Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { getUsersFromSpace, getUser } from '@/lib/fetch-functions';
import UserAvatar from '@/components/shared/UserAvatar/user-avatar';
import { MembersListEditable } from './members-list-editable';

/**
 * Group of avatars from users fetched from a specific space
 * This is a server component, it fetches the users pictures and we can pass it down as props/children to a
 * client component.
 */
export async function AvatarsGroup({ spaceId }: {spaceId: number}) {
    const maxAvatarsShown: number = 4;
    const response: PaginatedResponse<MemberT> = await getUsersFromSpace(spaceId, maxAvatarsShown);

    if (response?.error) {
        return <></>
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
 * This is a server component that fetches all members and displays them in a list format.
 * Reusable across space cards and single space pages.
 */
export async function MembersList({ spaceId }: { spaceId: number }) {
    const maxMembersShown: number = 20;
    const response: PaginatedResponse<MemberT> = await getUsersFromSpace(spaceId, maxMembersShown);

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
 * Server component that fetches members and renders MembersListEditable with remove functionality.
 * Use this in places where users should be able to remove members from the space (e.g., single space page).
 */
export async function MembersListWithRemove({ spaceId }: { spaceId: number }) {
    const maxMembersShown: number = 20;
    const response: PaginatedResponse<MemberT> = await getUsersFromSpace(spaceId, maxMembersShown);
    const currentUser = await getUser();

    if (response?.error) {
        return (
            <Box py={2}>
                <Typography variant="body2" color="text.secondary">
                    Unable to load members.
                </Typography>
            </Box>
        );
    }

    const currentUserMember = response.results.find((m: MemberT) => m.id === currentUser?.id);
    const isCurrentUserAdmin = currentUserMember?.spacerole?.role === 'admin';

    return (
        <MembersListEditable
            members={response.results}
            totalCount={response.count}
            spaceId={spaceId}
            currentUserId={currentUser?.id}
            isCurrentUserAdmin={isCurrentUserAdmin}
        />
    );
}