/**
 * React Query key factory.
 * Centralises every cache key so invalidation is consistent across the app.
 */
export const queryKeys = {
    // ---- User ----
    user: ['user'] as const,

    // ---- Spaces ----
    spaces: ['spaces'] as const,
    space: (id: number) => ['space', id] as const,

    // ---- Space members ----
    spaceMembers: (spaceId: number, limit?: number) =>
        limit !== undefined
            ? (['space', spaceId, 'members', limit] as const)
            : (['space', spaceId, 'members'] as const),

    // ---- Space checkmarks (date-range pagination) ----
    spaceCheckmarks: (spaceId: number, dateRange?: string) =>
        dateRange !== undefined
            ? (['space', spaceId, 'checkmarks', dateRange] as const)
            : (['space', spaceId, 'checkmarks'] as const),

    // ---- Habits ----
    recurrentHabits: ['habits', 'recurrent'] as const,
};
