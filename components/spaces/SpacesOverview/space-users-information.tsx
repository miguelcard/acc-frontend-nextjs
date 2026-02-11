import 'server-only';
import React from 'react';
import { MemberT, PaginatedResponse } from '@/lib/types-and-constants';
import AvatarGroup from '@mui/material/AvatarGroup';
import { getUsersFromSpace } from '@/lib/fetch-functions';
import UserAvatar from '@/components/shared/UserAvatar/user-avatar';
import { Box, List, ListItem, ListItemAvatar, ListItemText, Typography, Divider } from '@mui/material';

/**
 * Group of avatars from users fetched from a specific space
 * This is a server component, it fetches the users pictures and we can pass it down as props/children to a
 * client component.
 */
export async function AvatarsGroup({ spaceId }: {spaceId: number}) {
    const maxPhotosShown: number = 4;
    const response: PaginatedResponse<MemberT> = await getUsersFromSpace(spaceId, maxPhotosShown);

    if (response?.error) {
        return <></>
    }

    return (
        <AvatarGroup
            max={maxPhotosShown}
            total={response.count}
            sx={{
                avatar: {
                    fontSize: '0.875rem',
                    backgroundColor: '#6d7efc',
                },
                cursor: 'default',
            }}
        >
            {response.results.map((user: MemberT) => (

                <UserAvatar key={user.id} user={user} initialsFontSize='1.2rem' />
            ))}
        </AvatarGroup>
    );
}


/**
 * Detailed list of all members in a space showing avatar, username, and name
 * This is a server component that fetches all members and displays them in a list format
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
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" >
                Members ({response.count})
            </Typography>
            <List sx={{ width: '100%', bgcolor: 'background.paper', maxHeight: 300, overflow: 'auto' }}>
                {response.results.map((member: MemberT, index: number) => (
                    <React.Fragment key={member.id}>
                        <ListItem alignItems="flex-start" sx={{ px: 0, py: 0.5 }}>
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
                        {index < response.results.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                ))}
            </List>
            <Divider sx={{ my: 0 }} />
        </Box>
    );
}

/**
 * Its the default description of the space if none exists, just shows a random username that is member of that
 * space and the total of users who belong there.
 */
export async function SpaceDefaultDescription({ spaceId }: {spaceId: number}) {
    const response: PaginatedResponse<MemberT> = await getUsersFromSpace(spaceId, 3);
    const members: MemberT[] = response.results;

    if (members?.length > 0) {
        const randomIndex = Math.floor(Math.random() * members.length);
        const user: MemberT = members[randomIndex];

        // This is automatically wrapped with a Typography element on the CustomCard component
        // even more meaningful would be to show total number of habits shared in this space ?
        return (
            <>
                <b>{user.username}</b> and {response.count - 1} others are members of this group.
            </>
        );
    } else {
        return <></>;
    }
}
