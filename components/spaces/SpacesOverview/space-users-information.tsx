import 'server-only';
import { PaginatedResponse } from '@/lib/types-and-constants';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { getLetter, stringToColor } from './avatar-utils';
import { getUsersFromSpace } from '@/lib/fetch-functions';

interface SpaceUser {
    id: number;
    username: string;
    name: string | null;
    last_name: string | null;
    profile_photo: string | null;
    // email: string;
    // about?: string | null;
    // is_active?: boolean;
}


/**
 * Group of avatars from users fetched from a specific space
 * This is a server component, it fetches the users pictures and we can pass it down as props/children to a
 * client component.
 */
export async function AvatarsGroup({ spaceId }: {spaceId: number}) {
    const maxPhotosShown: number = 4;
    const users: PaginatedResponse<SpaceUser> = await getUsersFromSpace(spaceId, maxPhotosShown);

    return (
        <AvatarGroup
            max={maxPhotosShown}
            total={users.count}
            sx={{
                avatar: {
                    fontSize: '0.875rem',
                    backgroundColor: '#6d7efc',
                },
                cursor: 'default',
            }}
        >
            {users.results.map((user: SpaceUser) => (
                <Avatar
                    key={user.id}
                    src={`${user.profile_photo}`}
                    sx={{ bgcolor: user.profile_photo ? 'inherit' : stringToColor(user.username + user.id) }}
                >
                    {getLetter(user.name, user.last_name, user.username)}
                </Avatar>
            ))}
        </AvatarGroup>
    );
}


/**
 * Its the default description of the space if none exists, just shows a random username that is member of that
 * space and the total of users who belong there.
 */
export async function SpaceDefaultDescription({ spaceId }: {spaceId: number}) {
    const users: PaginatedResponse<SpaceUser> = await getUsersFromSpace(spaceId, 3);
    const results: SpaceUser[] = users.results;

    if (results.length > 0) {
        const randomIndex = Math.floor(Math.random() * results.length);
        const user: SpaceUser = results[randomIndex];

        // This is automatically wrapped with a Typography element on the CustomCard component
        // even more meaningful would be to show total number of habits shared in this space ?
        return (
            <>
                <b>{user.username}</b> and {users.count - 1} others are members of this group.
            </>
        );
    } else {
        return <></>;
    }
}
