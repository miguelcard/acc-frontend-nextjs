// Client-side API functions for mutations (create, update, delete operations).
// These functions call the backend API directly using Firebase auth tokens.
// They can be called from client components via event handlers (onClick, onSubmit, etc.)

import { createUrl, extractCustomErrorMessageIfExists, getApiErrorMessage, getErrorMessage } from './utils/utils';
import { authenticatedFetch } from '@/lib/authenticated-fetch';
import { FormikValues } from 'formik';
import { CreateHabitT, GENERIC_ERROR_MESSAGE, CheckMarkT, HabitT } from './types-and-constants';

const API = process.env.NEXT_PUBLIC_API;

// ----- Spaces Actions -----

/**
 * Server action to call the create space endpoint
 * @param formData
 * @returns space information
 */
export async function createSpace(formData: FormikValues) {
    const createSpaceUrl: string = `${process.env.NEXT_PUBLIC_API}/v1/spaces/`;

    try {
        const res = await authenticatedFetch(createSpaceUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (!res.ok) {
            const errorResp = await res.json();
            console.warn('createSpace Error: ' + getErrorMessage(errorResp));
            console.warn(JSON.stringify(errorResp));
            // Use structured error mapper if the response has an error code,
            // otherwise fall back to legacy extraction
            if (errorResp?.error?.code) {
                return { error: getApiErrorMessage(errorResp) };
            }
            const customErrorMessageIfExists: string | undefined = extractCustomErrorMessageIfExists(errorResp);
            return { error: customErrorMessageIfExists ?? GENERIC_ERROR_MESSAGE };
        }

        return await res.json();
    } catch (error) {
        console.warn('createSpace server action Error: ', getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
}

/**
 * Server action to call the patch Space endpoint
 * @param formData
 * @returns space object
 */
export async function patchSpace(formData: FormikValues, id: number) {
    const patchSpaceUrl: string = `${process.env.NEXT_PUBLIC_API}/v1/spaces/${id}/simple/`;

    try {
        const res = await authenticatedFetch(patchSpaceUrl, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        // TODO handle this more graceful if user is unauthorized or something like that
        if (!res.ok) {
            const errorResp = await res.json();
            console.warn('patchSpace Error: ' + getErrorMessage(errorResp));
            console.warn(JSON.stringify(errorResp));
            return { error: GENERIC_ERROR_MESSAGE };
        }

        return await res.json();
    } catch (error) {
        console.warn('patchSpace server action Error: ', getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
}


/**
 * Server action to get all habits from an space based on its Id and the date range query params
 * @param sapceId Id of space
 * @param dateString string containing cm_to_date and cm_from_date which are range of date for checkmaks
 * @returns habits for spacific owner
 */
export async function getAllHabitsAndCheckmarksFromSpace(spaceId: number, dateString: string) {
    const url = `${API}/v1/spaces/${spaceId}/checkmarks/?${dateString}`;

    const res = await authenticatedFetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    const space = await res.json();

    if (!res.ok) {
        throw new Error(getErrorMessage(space) || 'Failed to fetch checkmarks');
    }
    return space;
}

// ----- SpaceRoles Actions -----

/**
 * Server action to call the create SpaceRole endpoint (to link a user to a space)
 * @param formData
 * @returns space information
 */
export async function createSpaceRole(formData: FormikValues, spaceId: number) {
    const createSpaceRoleUrl: string = `${process.env.NEXT_PUBLIC_API}/v1/spaceroles/invite/`;

    try {
        const res = await authenticatedFetch(createSpaceRoleUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (!res.ok) {
            const errorResp = await res.json();
            console.warn('createSpaceRole Error: ' + getErrorMessage(errorResp));
            console.warn(JSON.stringify(errorResp));
            const customErrorMessageIfExists: string | undefined = extractCustomErrorMessageIfExists(errorResp);
            return { error: customErrorMessageIfExists ?? 'Unable to invite user, please check that the username or email are correct or try again later.' };
        }

        return await res.json();
    } catch (error) {
        console.warn('createSpaceRole server action Error: ', getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
}


/**
 * Server action to call the delete Spacerole endpoint.
 * Unlinks a user from a space by deleting the space role associated with 
 * it also changes the user role to another user, if the one leaving was the creator of the space
 * unlinks all habits from that user in that space (but the habits are not deleted)
 * deletes space IF the space has no more members in it
 * @returns deletion status
 */
export async function deleteSpaceRole(spaceId: number) {
    const deleteSpaceRoleUrl: string = `${process.env.NEXT_PUBLIC_API}/v1/spaceroles/delete/${spaceId}`;

    try {
        const res = await authenticatedFetch(deleteSpaceRoleUrl, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
            const errorResp = await res.json();
            console.warn('deleteSpaceRole Error: ' + getErrorMessage(errorResp));
            console.warn(JSON.stringify(errorResp));
            return { error: GENERIC_ERROR_MESSAGE };
        }

        return {}; // empty body as the delete response has no body to parse
    } catch (error) {
        console.warn('deleteSpaceRole server action Error: ', getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
}

/**
 * Server action to remove another user from a space (admin functionality)
 * Calls the delete member endpoint with spaceId and userId
 * @param spaceId The ID of the space
 * @param userId The ID of the user to remove
 * @returns deletion status
 */
export async function removeUserFromSpace(spaceId: number, userId: number) {
    const removeUserUrl: string = `${process.env.NEXT_PUBLIC_API}/v1/spaces/${spaceId}/members/${userId}`;

    try {
        const res = await authenticatedFetch(removeUserUrl, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
            const errorResp = await res.json();
            console.warn('removeUserFromSpace Error: ' + getErrorMessage(errorResp));
            console.warn(JSON.stringify(errorResp));
            return { error: extractCustomErrorMessageIfExists(errorResp) };
        }

        return {}; // empty body as the delete response has no body to parse
    } catch (error) {
        console.warn('removeUserFromSpace server action Error: ', getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
}

/**
 * Server action to update a user's spacerole (e.g., promote to admin or demote to member)
 * Calls PATCH /api/v1/spaceroles/manage/{spaceroleId}
 * @param spaceroleId The ID of the spacerole to update
 * @param role The new role to assign ('admin' or 'member')
 * @param spaceId The ID of the space (for cache revalidation)
 * @returns updated spacerole or error
 */
export async function updateSpaceRole(spaceroleId: number, role: string, spaceId: number) {
    const url = `${process.env.NEXT_PUBLIC_API}/v1/spaceroles/manage/${spaceroleId}`;

    try {
        const res = await authenticatedFetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role }),
        });

        if (!res.ok) {
            const errorResp = await res.json();
            console.warn('updateSpaceRole Error: ' + getErrorMessage(errorResp));
            return { error: extractCustomErrorMessageIfExists(errorResp) };
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.warn('updateSpaceRole server action Error: ', getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
}


// ------ Users Actions ------


/**
 * This function calls the endpoint which retrieves a list of users which match either by username or email the value
 * given on the search parameter
 *
 * @param member either the username or email
 * @param resultsNumber resutls per page
 * @returns list of users who match either that username or email
 */
export async function getUsernameEmailSuggestions(member: string, resultsNumber: number) {
    const getUsernameEmailSuggestionsUrl: string = `${process.env.NEXT_PUBLIC_API}/v1/users/usernames-emails/?search=${member}&page_size=${resultsNumber}`;

    try {
        const res = await authenticatedFetch(getUsernameEmailSuggestionsUrl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
            const errorResp = await res.json();
            console.warn('getUsernameEmailSuggestions server action Error: ' + getErrorMessage(errorResp));
            console.warn(JSON.stringify(errorResp));
            return { error: GENERIC_ERROR_MESSAGE };
        }

        return await res.json();
    } catch (error) {
        console.warn('getUsernameEmailSuggestions server action Error: ', getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
}

/**
 * Calls backend to check if a given username or email is already taken or not
 *
 * @param username the username or null
 * @param email the email or null
 * @returns { email_taken: true } or { username_taken: true }
 */
export async function checkUsernameOrEmailExist(username: string | null, email: string | null) {
    const checkUrl: string = `${process.env.NEXT_PUBLIC_API}/v1/users/username-or-email-exists/`;

    const params = new URLSearchParams();
    username && params.append('username', username);
    email && params.append('email', email);

    const finalUrl: string = createUrl(checkUrl, params);

    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    try {
        const res = await fetch(finalUrl, requestOptions);

        if (!res.ok) {
            const errorResp = await res.json();
            console.warn('checkUsernameOrEmailExist server action Error: ' + getErrorMessage(errorResp));
            console.warn(JSON.stringify(errorResp));
            return { error: GENERIC_ERROR_MESSAGE };
        }

        return await res.json();
    } catch (error) {
        console.warn('checkUsernameOrEmailExist server action Error: ', getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
}

/**
 * Server action to call the patch User endpoint
 * @param formData
 * @returns space object
 */
export async function patchUser(formData: FormikValues) {
    const url: string = `${process.env.NEXT_PUBLIC_API}/v1/user/`;

    try {
        const res = await authenticatedFetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (!res.ok) {
            const errorResp = await res.json();
            console.warn('patchUser Error: ' + getErrorMessage(errorResp));
            console.warn(JSON.stringify(errorResp));
            return { error: GENERIC_ERROR_MESSAGE };
        }
        
        return await res.json();
    } catch (error) {
        console.warn('patchUser server action Error: ', getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
}


//==================================== Habit actions =======================================

/**
 * Server action to create new habit
 * @param CreateHabitT
 * @returns habit information
 */
export async function createHabit(habit: CreateHabitT) {
    const createHabitUrl: string = `${API}/v1/habits/recurrent/`;

    try {
        const res = await authenticatedFetch(createHabitUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(habit),
        });

        if (!res.ok) {
            const errorResp = await res.json();
            console.warn('createHabit Error: ' + getErrorMessage(errorResp));
            console.warn(JSON.stringify(errorResp));
            const userFacingErrorMessage: string = getApiErrorMessage(errorResp);
            console.warn(userFacingErrorMessage);
            return { error: userFacingErrorMessage };
        }

        return await res.json();
    } catch (error) {
        console.warn('createHabit server action Error: ', getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
}

/**
 * Server action to call the patch Habit
 * @param newHabitData
 * @returns Habit object
 */
export async function patchHabit(newHabitData: any, id: number) {
    const patchHabitUrl: string = `${process.env.NEXT_PUBLIC_API}/v1/habits/recurrent/${id}`;

    try {
        const res = await authenticatedFetch(patchHabitUrl, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newHabitData),
        });

        if (!res.ok) {
            const errorResp = await res.json();
            console.warn('patchHabit Error: ' + getErrorMessage(errorResp));
            console.warn(JSON.stringify(errorResp));
            return { error: GENERIC_ERROR_MESSAGE };
        }

        return await res.json();
    } catch (error) {
        console.warn('patchHabit server action Error: ', getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
}

/**
 * Server action to call the DELETE habit
 * @param habit
 * @returns void
 */
export async function deleteHabit(habit: HabitT) {
    const deleteHabitUrl: string = `${API}/v1/habits/recurrent/${habit.id}`;

    try {
        const res = await authenticatedFetch(deleteHabitUrl, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(habit),
        });

        if (!res.ok) {
            const errorResp = await res.json();

            console.warn('deleteHabit Error: ' + getErrorMessage(errorResp));
            console.warn(JSON.stringify(errorResp));
            return { error: GENERIC_ERROR_MESSAGE };
        }

        return {};
    } catch (error) {
        console.warn('deleteHabit server action Error: ', getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
}

// ----------- Habit's Checkmarks actions ---------

/**
 * Server action to call the create checkmark endpoint
 * @param CheckMarkT
 * @returns habit information
 */
export async function addCheckmark(checkmark: { habit: number; status: string; date: string, client_date: string }) {
    const addCheckmarkUrl: string = `${API}/v1/habits/recurrent/${checkmark.habit}/checkmarks/`;

    try {
        const res = await authenticatedFetch(addCheckmarkUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(checkmark),
        });

        if (!res.ok) {
            const errorResp = await res.json();
            console.warn('addCheckmark Error: ' + getErrorMessage(errorResp));
            console.warn(JSON.stringify(errorResp));
            return { error: GENERIC_ERROR_MESSAGE };
        }

        return await res.json();
    } catch (error) {
        console.warn('addCheckmark server action Error: ', getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
}

/**
 * Server action to call the delete checkmark endpoint
 * @param CheckMarkT
 * @returns habit information
 */
export async function deleteCheckmark(checkmark: CheckMarkT) {
    const deleteCheckmarkUrl: string = `${API}/v1/habits/recurrent/${checkmark.habit}/checkmarks/${checkmark.id}`;

    try {
        const res = await authenticatedFetch(deleteCheckmarkUrl, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(checkmark),
        });

        if (res.status !== 204) {
            const errorResp = await res.json();
            console.warn('deleteCheckmark Error: ' + getErrorMessage(errorResp));
            console.warn(JSON.stringify(errorResp));
            return { error: GENERIC_ERROR_MESSAGE };
        }

        return { error: null };
    } catch (error) {
        console.warn('deleteCheckmark server action Error: ', getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
}
