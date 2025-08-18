import 'server-only';
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
