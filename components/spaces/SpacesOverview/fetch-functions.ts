import { getAuthCookie, getErrorMessage } from "@/lib/utils";
import { GENERIC_ERROR_MESSAGE } from '@/lib/types-and-constants';


/**
 * Fetches a minimalistic list of the users who belong to that space
 * @returns list users
 */
export async function getUsersFromSpace(spaceId: number, resultsNumber: number) {
    const url = `${process.env.NEXT_PUBLIC_API}/v1/spaces/${spaceId}/users/?page=1&page_size=${resultsNumber}&ordering=${getRandomUserOrderingQueryValue()}`;
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${getAuthCookie()}`,
        },
    };

    try {
        const res = await fetch(url, requestOptions);
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

/**
 * Gets the a random query for the query parameter "ordering" either ascending or descending for either the updated_at or username fields
 * @returns query value
 */
function getRandomUserOrderingQueryValue(): string {
    // Use the random number to determine the ordering ascending/descending
    const orderDirection: string = Math.random() < 0.5 ? '-' : '';
    const field: string = Math.random() < 0.5 ? 'updated_at' : 'username';

    return orderDirection + field;
}