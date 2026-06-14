// generic message to throw to the client
export const GENERIC_ERROR_MESSAGE = 'An unknown error occurred, please refresh the page or try again later.';

/**
 * Generic paginated response, takes any type
 */
export interface PaginatedResponse<T> {
    count: number;
    next: null | string;
    previous: null | string;
    results: T[];
    error?: string;
}

export const timeFrames = [
    { label: 'Weekly', value: 'W' },
    { label: 'Monthly', value: 'M' },
];

/**
 * Simple Space interface
 */
export type SpaceT = {
    id: number;
    name: string;
    description?: string;
    tags?: string[];
    members_count?: number;
    habits_count?: number;
    space_habits?: HabitT[];
    created_at?: string;
    updated_at?: string;
    // creator?: ?;
    members?: MemberT[];
    icon_alias?: string;
    error?: string; // just in case we add an error to the response
};

export interface CreatorUser {
    id: number;
    username: string;
    name: string | null;
    avatar_seed: string | null;
    // email: string;
    // about?: string | null;
    // is_active?: boolean;
}

export interface SpaceDetailed extends SpaceT {
    creator: CreatorUser;
}

export type HabitT = {
    id: number;
    tags: any[];
    checkmarks: CheckMarkT[];
    title: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    type: string;
    times: number;
    time_frame: string;
    owner: number;
    spaces: number[];
    error?: string;
    /** Optional streak data returned by the backend. Absent = no badge shown. */
    streak?: { count: number; unit: 'W' | 'M' };
    /** Historical config changes, sorted ascending by effective_from. Used to resolve the
     *  correct `times` target for past periods without retroactive distortion. */
    config_history?: { effective_from: string; times: number; time_frame: string }[];
    /** Only present on a PATCH response when time_frame was changed. Indicates when the
     *  new time_frame takes effect so the UI can show a transition snackbar. */
    config_transition?: {
        old_time_frame: 'W' | 'M';
        new_time_frame: 'W' | 'M';
        new_effective_from: string; // ISO date e.g. "2025-06-01"
    };
};

/**
 * this type is for checked Dates in the space_habit,
 */
export type CheckedDatesT = { [date: string]: { [habitId: string]: CheckMarkT } };

/**
 * this type is for single checkmarks,
 */
export type CheckMarkT = {
    created_at: Date;
    date: string;
    habit: number;
    id: number;
    status: string;
    updated_at: Date;
};

/**
 * this type is for create habit input params
 */
export type CreateHabitT = {
    title: string;
    description: string;
    times: number;
    time_frame: string;
    spaces: number[];
    [key: string]: any;
};

export type UserT = {
    id: number;
    user_spaces: number[];
    username: string;
    name: any | null;
    email: string;
    created_at: Date;
    updated_at: Date;
    is_active: boolean;
    is_staff: boolean;
    is_superuser: boolean;
    profile_photo: string | null;
    avatar_seed: string | null;
    // TODO  Not defined yet but define them as req needs
    // tags: any;
    // languages: any;
    // age: any;
    // owned_spaces: any;
    // last_login: Date;
    // birthdate: any;
    // gender: any;
    // about: any;
    // groups: any;
    // user_permissions: any;
    error?: string;
};

export type SpaceRoleT = {
    id: number;
    role: string;
    created_at: string;
    updated_at: string;
};

export type MemberT = {
    id: number;
    username: string;
    name: string | null;
    avatar_seed: string | null;
    email: string;
    about: any;
    is_active: boolean;
    spacerole?: SpaceRoleT;
};

/**
 * XP heatmap entry — one cell per period with total XP earned.
 */
export type XPHeatmapEntryT = {
    period_start: string; // ISO date string e.g. '2025-04-28'
    xp: number;
};

/**
 * Full XP stats payload returned by GET /api/v1/user/xp-stats/
 */
export type XPStatsT = {
    total_xp: number;
    level: number;
    xp_into_level: number;     // XP accumulated since reaching this level
    xp_for_level: number;      // XP gap to advance to next level
    pct_to_next: number;       // 0.0–1.0
    longest_streak: number;         // in completed periods
    longest_streak_unit: 'W' | 'M'; // timeframe of the longest streak row
    completed_periods: number;
    heatmap: XPHeatmapEntryT[];
};

/**
 * Public XP stats for any user — returned by GET /api/v1/users/:id/public-stats/
 * Same shape as XPStatsT but without the private heatmap field.
 */
export type MemberPublicStatsT = {
    level: number;
    total_xp: number;
    xp_into_level: number;
    xp_for_level: number;
    pct_to_next: number;
    longest_streak: number;
    longest_streak_unit: 'W' | 'M';
    completed_periods: number;
};
