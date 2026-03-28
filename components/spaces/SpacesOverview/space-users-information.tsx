'use client';
import { MemberT, PaginatedResponse } from '@/lib/types-and-constants';
import { useSpaceMembers } from '@/lib/hooks/queries';

// Re-export shared components for backwards compatibility
export { AvatarsGroup, MembersList, MembersListWithRemove } from '@/components/shared/SpaceMembers/space-members';
export { ClickableAvatarsGroup } from '@/components/shared/SpaceMembers/clickable-avatars-group';

/**
 * Its the default description of the space if none exists, just shows a random username that is member of that
 * space and the total of users who belong there.
 */
export function SpaceDefaultDescription({ spaceId }: {spaceId: number}) {
    const { data: response } = useSpaceMembers(spaceId, 3);

    if (!response || !response.results?.length) {
        return null;
    }

    const members: MemberT[] = response.results;
    const randomIndex = Math.floor(Math.random() * members.length);
    const user: MemberT = members[randomIndex];

    return (
        <>
            <b>{user.username}</b> and {response.count - 1} others are members of this group.
        </>
    );
}
