// Client-side API functions for read-only data fetching.
// These functions call the backend API directly using Firebase auth tokens.
// NOTE: These functions THROW on failure so React Query can manage
//       error state, retries, and isError properly.
import { authenticatedFetch } from '@/lib/authenticated-fetch';
import { getErrorMessage } from '@/lib/utils/utils';


// ----- Spaces -----

/**
 * Get Space by its ID
 * @param id
 * @returns space
 */
export async function getSpace(id: number) {
    
    const url = `${process.env.NEXT_PUBLIC_API}/v1/spaces/${id}`;

    const res = await authenticatedFetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    const space = await res.json();

    if (!res.ok) {
        throw new Error(getErrorMessage(space) || 'Failed to fetch space');
    }
    return space;
}


/**
 * Gets all the spaces that belong to the user
 * @returns list of spaces
 */
export async function getUserSpaces() {
    const url = `${process.env.NEXT_PUBLIC_API}/v1/spaces/?page=1&page_size=20&ordering=-updated_at`; // TODO user wont be able too see more results than the page size at the moment, possible bug

    const res = await authenticatedFetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    const spaces = await res.json();
    if (!res.ok) {
        throw new Error(getErrorMessage(spaces) || 'Failed to fetch spaces');
    }
    return spaces;
}




// ----- Users -----

/**
 * This function gets logged-in users data
 * @returns user who is logged-in
 */
export async function getUser() {
    const getUserUrl: string = `${process.env.NEXT_PUBLIC_API}/v1/user/`;

    const res = await authenticatedFetch(getUserUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
        const errorResp = await res.json();
        throw new Error(getErrorMessage(errorResp) || 'Failed to fetch user');
    }

    return await res.json();
}



/**
 * Fetches a minimalistic list of the users who belong to that space
 * @returns list users
 */
export async function getUsersFromSpace(spaceId: number, resultsNumber: number) {
    const url = `${process.env.NEXT_PUBLIC_API}/v1/spaces/${spaceId}/users/?page=1&page_size=${resultsNumber}&ordering=${getRandomUserOrderingQueryValue()}`;

    const res = await authenticatedFetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    const users = await res.json();
    if (!res.ok) {
        throw new Error(getErrorMessage(users) || 'Failed to fetch space members');
    }
    return users;
}


// ----- Habits -----

/**
 * This function gets logged-in user's recurrent habits
 */
export async function getAllUserRecurrentHabits() {
    const url = `${process.env.NEXT_PUBLIC_API}/v1/habits/recurrent/?page=1&page_size=100&ordering=-spaces__id`; // TODO user wont be able too see more results than the page size at the moment, possible bug

    const res = await authenticatedFetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    const habits = await res.json();
    if (!res.ok) {
        throw new Error(getErrorMessage(habits) || 'Failed to fetch habits');
    }
    return habits;
}



// ----- Helpers -----
/**
 * Helper function for getUsersFromSpace()
 * Gets the a random query for the query parameter "ordering" either ascending or descending for either the updated_at or username fields
 * @returns query value
 */
function getRandomUserOrderingQueryValue(): string {
    // Use the random number to determine the ordering ascending/descending
    const orderDirection: string = Math.random() < 0.5 ? '-' : '';
    const field: string = Math.random() < 0.5 ? 'updated_at' : 'username';

    return orderDirection + field;
}