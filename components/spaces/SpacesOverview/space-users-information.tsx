import 'server-only';
import { MemberT, PaginatedResponse } from '@/lib/types-and-constants';
import { getUsersFromSpace } from '@/lib/fetch-functions';

// Re-export shared components for backwards compatibility
export { AvatarsGroup, MembersList } from '@/components/shared/SpaceMembers/space-members';

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
