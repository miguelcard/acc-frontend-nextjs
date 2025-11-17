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
 * @param spaces - Array of spaces where the user belongs, it can be that the user does not habe a habit in this space, in that case we dont show it.
 * @returns Array of spaces and habits sorted by space name
 */
export function groupHabitsBySpace(
    habits: HabitT[],
    spaces: SpaceT[]
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
    // Only includes spaces that have at least one habit
    const groupedHabits: SpaceHabitsGroup[] = Array.from(spaceHabitsMap.entries()).map(
        ([spaceId, spaceHabits]) => ({
            space: spaceMap.get(spaceId)!,
            habits: spaceHabits.sort((a, b) => 
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            ),
        })
    );

    // sort by spacename for consistent ordering
    return groupedHabits.sort((a, b) => 
        a.space.name.localeCompare(b.space.name)
    );
}