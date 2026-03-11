// Client-side API functions for read-only data fetching.
// These functions call the backend API directly using Firebase auth tokens.
import { authenticatedFetch } from '@/lib/authenticated-fetch';
import { getErrorMessage } from '@/lib/utils/utils';
import { GENERIC_ERROR_MESSAGE } from '@/lib/types-and-constants';


// ----- Spaces -----

/**
 * Get Space by its ID
 * @param id
 * @returns space
 */
export async function getSpace(id: number) {
    
    const url = `${process.env.NEXT_PUBLIC_API}/v1/spaces/${id}`;

    try {
        const res = await authenticatedFetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const space = await res.json();

        if (!res.ok) {
            console.warn("Fetching individual space didn't work");
            console.warn(getErrorMessage(space));
            return { error: GENERIC_ERROR_MESSAGE };
        }
        return space;
    } catch (error) {
        console.warn('getSpace Error: ', getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
}


/**
 * Gets all the spaces that belong to the user
 * @returns list of spaces
 */
export async function getUserSpaces() {
    const url = `${process.env.NEXT_PUBLIC_API}/v1/spaces/?page=1&page_size=20&ordering=-updated_at`; // TODO user wont be able too see more results than the page size at the moment, possible bug

    try {
        const res = await authenticatedFetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const spaces = await res.json();
        if (!res.ok) {
            console.warn("Fetching user spaces didn't work");
            console.warn(getErrorMessage(spaces));
            return { error: GENERIC_ERROR_MESSAGE };
        }
        return spaces;
    } catch (error) {
        console.warn('An error ocurred: ', getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
}




// ----- Users -----

/**
 * This function gets logged-in users data
 * @returns user who is logged-in
 */
export async function getUser() {
    const getUserUrl: string = `${process.env.NEXT_PUBLIC_API}/v1/user/`;

    try {
        const res = await authenticatedFetch(getUserUrl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
            const errorResp = await res.json();
            console.warn('getUser Error: ' + getErrorMessage(errorResp));
            console.warn(JSON.stringify(errorResp));
            return { error: GENERIC_ERROR_MESSAGE };
        }

        return await res.json();
    } catch (error) {
        console.warn('getUser Error: ', getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
}



/**
 * Fetches a minimalistic list of the users who belong to that space
 * @returns list users
 */
export async function getUsersFromSpace(spaceId: number, resultsNumber: number) {
    const url = `${process.env.NEXT_PUBLIC_API}/v1/spaces/${spaceId}/users/?page=1&page_size=${resultsNumber}&ordering=${getRandomUserOrderingQueryValue()}`;

    try {
        const res = await authenticatedFetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const users = await res.json();
        if (!res.ok) {
            console.warn("Fetching users that belong to a space didn't work");
            console.warn(getErrorMessage(users));
            return { error: GENERIC_ERROR_MESSAGE };
        }
        return users;
    } catch (error) {
        console.warn('An error ocurred: ', getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
}


// ----- Habits -----

/**
 * This function gets logged-in user's recurrent habits
 */
export async function getAllUserRecurrentHabits() {
    const url = `${process.env.NEXT_PUBLIC_API}/v1/habits/recurrent/?page=1&page_size=100&ordering=-spaces__id`; // TODO user wont be able too see more results than the page size at the moment, possible bug

    try {
        const res = await authenticatedFetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const habits = await res.json();
        if (!res.ok) {
            console.warn("Fetching user recurring habits didn't work");
            console.warn(getErrorMessage(habits));
            return { error: GENERIC_ERROR_MESSAGE };
        }
        return habits;
    } catch (error) {
        console.warn('An error ocurred: ', getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
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