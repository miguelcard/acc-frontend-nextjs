

// generic message to throw to the client
export const GENERIC_ERROR_MESSAGE = "An unknown error occurred, please refresh the page or try again later.";


// generic paginated response
export interface PaginatedResponse<T> {
    count: number;
    next: null | string;
    previous: null | string;
    results: T[]
    error?: string;
}