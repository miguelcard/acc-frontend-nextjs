'use client';
import { MemberT, PaginatedResponse } from '@/lib/types-and-constants';
import AvatarGroup from '@mui/material/AvatarGroup';
import { getUsersFromSpace } from '@/lib/fetch-functions';
import UserAvatar from '@/components/shared/UserAvatar/user-avatar';

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
                cursor: 'default',
            }}
        >
            {response.results.map((user: MemberT) => (

                <UserAvatar key={user.id} user={user} initialsFontSize='1.2rem' />
            ))}
        </AvatarGroup>
    );
}