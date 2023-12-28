

// generic message to throw to the client
export const GENERIC_ERROR_MESSAGE = "An unknown error occurred, please refresh the page or try again later.";


/**
 * Generic paginated response, takes any type
 */
export interface PaginatedResponse<T> {
    count: number;
    next: null | string;
    previous: null | string;
    results: T[]
    error?: string;
}


/**
 * Simple Space interface
 */
export interface Space {
    id: number;
    name: string;
    description?: string;
    tags?: string[];
    members_count?: number;
    habits_count?: number;
    space_habits?: any[]; // Todo change for habits type, any[] for now
    created_at?: string;
    updated_at?: string;
    // creator?: ?;
    members?: number[];
    icon_alias?: string;
    error?: string;     // just in case we add an error to the response
  };