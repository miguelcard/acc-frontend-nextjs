import { HabitT, SpaceT } from '@/lib/types-and-constants';

export type SpaceHabitsGroup = {
    space: SpaceT;
    habits: HabitT[];
};

/**
 * Groups habits by their space.
 * Note: (theoretically) Habits can belong to multiple spaces, so a habit might appear in multiple groups.
 * 
 * @param habits - Array of habits to group that already belong to the user.
 * @param spaces - Array of spaces where the user belongs.
 * @param includeEmptySpaces - When true, also includes spaces with no habits (with an empty habits array). Defaults to false.
 * @returns Array of spaces and habits sorted by space name
 */
export function groupHabitsBySpace(
    habits: HabitT[],
    spaces: SpaceT[],
    includeEmptySpaces = false
): SpaceHabitsGroup[] {

    const spaceHabitsMap = new Map<number, HabitT[]>();
    // Group the habits by space.
    habits.forEach(habit => {
        habit.spaces.forEach(spaceId => {
            if (!spaceHabitsMap.has(spaceId)) {
                spaceHabitsMap.set(spaceId, []);
            }
            spaceHabitsMap.get(spaceId)!.push(habit);
        });
    });

    // Create space a map for O(1) space lookup <id, SpaceT>
    const spaceMap = new Map(spaces.map(space => [space.id, space]));

    // Convert map to array of SpaceHabitsGroup
    // For habits referencing a deleted space, use a fallback placeholder so habits remain visible
    const groupedHabits: SpaceHabitsGroup[] = Array.from(spaceHabitsMap.entries())
        .map(
        ([spaceId, spaceHabits]) => ({
            space: spaceMap.get(spaceId) ?? { id: spaceId, name: '(Deleted Space)', icon_alias: 'trash' },
            habits: spaceHabits.sort((a, b) => 
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            ),
        })
    );

    // When includeEmptySpaces is true, append spaces that have no habits yet
    if (includeEmptySpaces) {
        spaces.forEach(space => {
            if (!spaceHabitsMap.has(space.id)) {
                groupedHabits.push({ space, habits: [] });
            }
        });
    }

    // Sort: spaces with habits first (by name), then spaces without habits (by name)
    return groupedHabits.sort((a, b) => {
        const aHasHabits = a.habits.length > 0;
        const bHasHabits = b.habits.length > 0;
        if (aHasHabits !== bHasHabits) return aHasHabits ? -1 : 1;
        return a.space.name.localeCompare(b.space.name);
    });
}