'use client';
import { useEffect, useState } from 'react';
import { MemberT, PaginatedResponse } from '@/lib/types-and-constants';
import { getUsersFromSpace } from '@/lib/fetch-functions';

// Re-export shared components for backwards compatibility
export { AvatarsGroup, MembersList, MembersListWithRemove } from '@/components/shared/SpaceMembers/space-members';
export { ClickableAvatarsGroup } from '@/components/shared/SpaceMembers/clickable-avatars-group';

/**
 * Its the default description of the space if none exists, just shows a random username that is member of that
 * space and the total of users who belong there.
 */
export function SpaceDefaultDescription({ spaceId }: {spaceId: number}) {
    const [description, setDescription] = useState<React.ReactNode>(null);

    useEffect(() => {
        getUsersFromSpace(spaceId, 3).then((response: PaginatedResponse<MemberT>) => {
            const members: MemberT[] = response.results;
            if (members?.length > 0) {
                const randomIndex = Math.floor(Math.random() * members.length);
                const user: MemberT = members[randomIndex];
                setDescription(
                    <>
                        <b>{user.username}</b> and {response.count - 1} others are members of this group.
                    </>
                );
            }
        });
    }, [spaceId]);

    return <>{description}</>;
}
