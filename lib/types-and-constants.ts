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
