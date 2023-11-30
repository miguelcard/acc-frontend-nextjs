import 'server-only';
import { GENERIC_ERROR_MESSAGE, PaginatedResponse } from '@/lib/types-and-constants';
import { getAuthCookie, getErrorMessage } from '@/lib/utils';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { getLetter, stringToColor } from './avatar-utils';
import Typography from '@mui/material/Typography';

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
 * Fetches a minimalistic list of the users who belong to that space
 * @returns list users
 */
async function getUsersFromSpace(spaceId: number, resultsNumber: number) {
    const url = `${process.env.NEXT_PUBLIC_API}/v1/spaces/${spaceId}/users/?page=1&page_size=${resultsNumber}&ordering=${getRandomUserOrderingQueryValue()}`;
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Cookie": `${getAuthCookie()}`,
        },
    };

    try {
        const res = await fetch(url, requestOptions);
        const users = await res.json();
        if (!res.ok) {
            console.warn("Fetching users that belong to a space didn't work");
            console.warn(getErrorMessage(users));
            return { error: GENERIC_ERROR_MESSAGE };
        }
        return users;

    } catch (error) {
        console.warn("An error ocurred: ", getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
}

interface SpaceIdProps {
    spaceId: number
}

/**
 * Group of avatars from users fetched from a specific space
 * This is a server component, it fetches the users pictures and we can pass it down as props/children to a 
 * client component.
 */
export async function AvatarsGroup({
    spaceId
}: SpaceIdProps) {

    const maxPhotosShown: number = 4;
    const users: PaginatedResponse<SpaceUser> = await getUsersFromSpace(spaceId, maxPhotosShown);

    return (
        <AvatarGroup max={maxPhotosShown} total={users.count}
            sx={{
                avatar: {
                    fontSize: '0.875rem',
                    backgroundColor: '#6d7efc',
                }, cursor: "default"
            }} >
            {users.results.map((user: SpaceUser) => (
                <Avatar
                    key={user.id}
                    src={`${user.profile_photo}`}
                    sx={{ bgcolor: user.profile_photo ? 'inherit' : stringToColor(user.username + user.id) }}
                    children={getLetter(user.name, user.last_name, user.username)}
                />
            ))}
        </AvatarGroup>
    )
}


/**
 * Its the default description of the space if none exists, just shows a random username that is member of that
 * space and the total of users who belong there.
 */
export async function SpaceDefaultDescription({
    spaceId
}: SpaceIdProps) {

    const users: PaginatedResponse<SpaceUser> = await getUsersFromSpace(spaceId, 3);
    const results: SpaceUser[] = users.results;

    if (results.length > 0) {
        const randomIndex = Math.floor(Math.random() * results.length);
        const user: SpaceUser = results[randomIndex];
        return (
            <>
                {/* This is automatically wrapped with a Typography element on the CustomCard component */}
                <b>{user.username}</b> and {users.count - 1} others are members of this group.
                {/* even more meaningful would be to show total number of habits shared in this space ? */}
            </>
        );
    } else {
        return (
            <>
            </>
        );
    }

}


/**
 * Gets the a random query for the query parameter "ordering" either ascending or descending for either the updated_at or username fields
 * @returns query value
 */
function getRandomUserOrderingQueryValue(): string {

    // Use the random number to determine the ordering ascending/descending
    const orderDirection: string = Math.random() < 0.5 ? '-' : '';
    const field: string = Math.random() < 0.5 ? 'updated_at' : 'username';

    return orderDirection + field;
}