'use server';
import 'server-only';
import { revalidatePath, revalidateTag } from 'next/cache';
import { createUrl, formDataToReqBody, getAuthCookie, getErrorMessage, setAuthCookie } from './utils';
import { FormikValues } from 'formik';
import { CreateHabitT, GENERIC_ERROR_MESSAGE, CheckMarksT, HabitT } from './types-and-constants';

// for now all server actions will be included here, later we can opt out for more modularity, i.e. separating them in different files.
type FormBodyObject = {
    [key: string]: FormDataEntryValue;
};

const API = process.env.NEXT_PUBLIC_API;

// ----- Auth Actions -----

/**
 * Calls login api with the data sent in the form and sets the http-only cookie with the authorization token
 * @param formData
 * @returns
 */
export async function login(formData: FormData) {
    const loginUrl: string = `${API}/v1/login/`;
    // create the request body using the formData
    const reqBody: FormBodyObject = formDataToReqBody(formData);

    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',

        body: JSON.stringify(reqBody),
    };

    try {
        const res: Response = await fetch(loginUrl, requestOptions);

        if (String(res.status)[0] === '4') {
            // if error code begins with 4
            return { error: 'email or password are incorrect' };
        }

        if (!res.ok) {
            const errorResp = await res.json();
            console.warn('Login server action Error: ' + getErrorMessage(errorResp));
            console.warn(JSON.stringify(errorResp));
            return { error: GENERIC_ERROR_MESSAGE };
        }

        const jsonResp = await res.json();

        setAuthCookie(res);
        return jsonResp;
    } catch (error) {
        console.warn('Login server action Error: ', getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
}

/**
 * Calls sign up api with the data sent in the form
 * @param formData
 * @returns user data
 */
export async function signUp(formData: FormData) {
    const signupUrl: string = `${API}/v1/register/`;
    const reqBody: FormBodyObject = formDataToReqBody(formData);

    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody),
    };

    try {
        const res: Response = await fetch(signupUrl, requestOptions);

        if (!res.ok) {
            const errorResp = await res.json();
            console.warn('Signup server action error: ' + getErrorMessage(errorResp));
            console.warn(JSON.stringify(errorResp));
            return { error: GENERIC_ERROR_MESSAGE };
        }

        setAuthCookie(res);
        return res.json();
    } catch (error: any) {
        console.warn('Signup server action error: ', getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
}

// ----- Spaces Actions -----

/**
 * Server action to call the create space endpoint
 * @param formData
 * @returns space information
 */
export async function createSpace(formData: FormikValues) {
    const createSpaceUrl: string = `${process.env.NEXT_PUBLIC_API}/v1/spaces/`;

    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${getAuthCookie()}`,
        },
        body: JSON.stringify(formData),
    };

    try {
        const res = await fetch(createSpaceUrl, requestOptions);

        if (!res.ok) {
            const errorResp = await res.json();
            console.warn('createSpace server action Error: ' + getErrorMessage(errorResp));
            console.warn(JSON.stringify(errorResp));
            return { error: GENERIC_ERROR_MESSAGE };
        }

        revalidatePath('/home');
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

    const requestOptions: RequestInit = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${getAuthCookie()}`,
        },
        body: JSON.stringify(formData),
    };

    try {
        const res = await fetch(patchSpaceUrl, requestOptions);

        if (!res.ok) {
            const errorResp = await res.json();
            console.warn('patchSpace server action Error: ' + getErrorMessage(errorResp));
            console.warn(JSON.stringify(errorResp));
            return { error: GENERIC_ERROR_MESSAGE };
        }

        revalidatePath(`/spaces/${id}`);
        return await res.json();
    } catch (error) {
        console.warn('patchSpace server action Error: ', getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
}

/**
 * Get Habits Space by its ID
 * @param id
 * @returns space
 */
export async function getSpace(id: number) {
    const url = `${process.env.NEXT_PUBLIC_API}/v1/spaces/${id}`;
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${getAuthCookie()}`,
        },
        next: { revalidate: 600, tags: ['spaces'] },
    };

    try {
        const res = await fetch(url, requestOptions);
        const space = await res.json();

        if (!res.ok) {
            console.warn("Fetching individual space didn't work");
            console.warn(getErrorMessage(space));
            return { error: GENERIC_ERROR_MESSAGE };
        }
        return space;
    } catch (error) {
        console.warn('getSpace server action Error: ', getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
}

/**
 * Server action to get habits based on space Id and the date range query params
 * @param sapceId Id of space
 * @param dateString string containing cm_to_date and cm_from_date which are range of date for checkmaks
 * @returns habits for spacific owner
 */
export async function getSpaceInRangeByOwner(spaceId: number, dateString: string) {
    const url = `${API}/v1/spaces/${spaceId}/checkmarks/?${dateString}`;

    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${getAuthCookie()}`,
        },
        next: { revalidate: 600, tags: ['spaces'] },
    };

    try {
        const res = await fetch(url, requestOptions);
        const space = await res.json();

        if (!res.ok) {
            console.warn("getSpaceInRangeByOwner didn't work");
            console.warn(getErrorMessage(space));
            return { error: GENERIC_ERROR_MESSAGE };
        }
        return space;
    } catch (error) {
        console.warn('getSpaceInRangeByOwner error ocurred: ', getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
}

// ----- SpaceRoles Actions -----

/**
 * Server action to call the create SpaceRole endpoint (to link a user to a space)
 * @param formData
 * @returns space information
 */
export async function createSpaceRole(formData: FormikValues, SpaceId: number) {
    const createSpaceRoleUrl: string = `${process.env.NEXT_PUBLIC_API}/v1/spaceroles/invite/`;

    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${getAuthCookie()}`,
        },
        body: JSON.stringify(formData),
    };

    try {
        const res = await fetch(createSpaceRoleUrl, requestOptions);

        if (!res.ok) {
            const errorResp = await res.json();
            console.warn('createSpaceRole server action Error: ' + getErrorMessage(errorResp));
            console.warn(JSON.stringify(errorResp));
            return { error: GENERIC_ERROR_MESSAGE };
        }

        revalidatePath(`/spaces/${SpaceId}`);
        return await res.json();
    } catch (error) {
        console.warn('createSpaceRole server action Error: ', getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
}

// ------ Users Actions ------

/**
 * This function gets logged-in users data
 * @returns user who is logged-in
 */
export async function getUser() {
    const getUserUrl: string = `${process.env.NEXT_PUBLIC_API}/v1/user/`;

    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${getAuthCookie()}`,
        },
    };

    try {
        const res = await fetch(getUserUrl, requestOptions);

        if (!res.ok) {
            const errorResp = await res.json();
            console.warn('getUser server action Error: ' + getErrorMessage(errorResp));
            console.warn(JSON.stringify(errorResp));
            return { error: GENERIC_ERROR_MESSAGE };
        }

        return await res.json();
    } catch (error) {
        console.warn('getUser server action Error: ', getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
}

/**
 * This function calls the endpoint which retrieces a list of users which match either by username or email the value
 * given on the search parameter
 *
 * @param member either the username or email
 * @param resultsNumber resutls per page
 * @returns list of users who match either that username or email
 */
export async function getUsernameEmailSuggestions(member: string, resultsNumber: number) {
    const getUsernameEmailSuggestionsUrl: string = `${process.env.NEXT_PUBLIC_API}/v1/users/usernames-emails/?search=${member}&page_size=${resultsNumber}`;

    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${getAuthCookie()}`,
        },
    };

    try {
        const res = await fetch(getUsernameEmailSuggestionsUrl, requestOptions);

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

// Habit actions

/**
 * Server action to create new habit
 * @param CreateHabitT
 * @returns habit information
 */
export async function createHabit(habit: CreateHabitT) {
    const createHabitUrl: string = `${API}/v1/habits/recurrent/`;

    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${getAuthCookie()}`,
        },
        body: JSON.stringify(habit),
    };

    try {
        const res = await fetch(createHabitUrl, requestOptions);

        if (!res.ok) {
            const errorResp = await res.json();
            console.warn('createHabit server action Error: ' + getErrorMessage(errorResp));
            console.warn(JSON.stringify(errorResp));
            return { error: GENERIC_ERROR_MESSAGE };
        }

        revalidatePath(`/spaces/${habit.spaces[0]}`);
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

    const requestOptions: RequestInit = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${getAuthCookie()}`,
        },
        body: JSON.stringify(newHabitData),
    };

    try {
        const res = await fetch(patchHabitUrl, requestOptions);

        // TODO handle this more graceful if user is unauthorized or something like that
        if (!res.ok) {
            const errorResp = await res.json();
            console.warn('patchHabit server action Error: ' + getErrorMessage(errorResp));
            console.warn(JSON.stringify(errorResp));
            return { error: GENERIC_ERROR_MESSAGE };
        }

        revalidateTag('spaces');
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

    const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${getAuthCookie()}`,
        },
        body: JSON.stringify(habit),
    };

    try {
        const res = await fetch(deleteHabitUrl, requestOptions);

        if (!res.ok) {
            const errorResp = await res.json();

            console.warn('deleteHabit server action Error: ' + getErrorMessage(errorResp));
            console.warn(JSON.stringify(errorResp));
            return { error: GENERIC_ERROR_MESSAGE };
        }

        revalidateTag('spaces');
        return { error: null };
    } catch (error) {
        console.warn('deleteHabit server action Error: ', getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
}

// ---- Habit's Checkmark actions ----

/**
 * Server action to call the create checkmark endpoint
 * @param CheckMarksT
 * @returns habit information
 */
export async function addCheckmark(checkmark: { habit: number; status: string; date: string }) {
    const addCheckmarkUrl: string = `${API}/v1/habits/recurrent/${checkmark.habit}/checkmarks/`;

    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${getAuthCookie()}`,
        },
        body: JSON.stringify(checkmark),
    };

    try {
        const res = await fetch(addCheckmarkUrl, requestOptions);

        if (!res.ok) {
            const errorResp = await res.json();
            console.warn('addCheckmark server action Error: ' + getErrorMessage(errorResp));
            console.warn(JSON.stringify(errorResp));
            return { error: GENERIC_ERROR_MESSAGE };
        }
        revalidateTag('spaces');

        return await res.json();
    } catch (error) {
        console.warn('addCheckmark server action Error: ', getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
}

/**
 * Server action to call the delete checkmark endpoint
 * @param CheckMarksT
 * @returns habit information
 */
export async function deleteCheckmark(checkmark: CheckMarksT) {
    const deleteCheckmarkUrl: string = `${API}/v1/habits/recurrent/${checkmark.habit}/checkmarks/${checkmark.id}`;

    const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${getAuthCookie()}`,
        },
        body: JSON.stringify(checkmark),
    };

    try {
        const res = await fetch(deleteCheckmarkUrl, requestOptions);

        if (res.status !== 204) {
            const errorResp = await res.json();
            console.warn('deleteCheckmark server action Error: ' + getErrorMessage(errorResp));
            console.warn(JSON.stringify(errorResp));
            return { error: GENERIC_ERROR_MESSAGE };
        }

        revalidateTag('spaces');
        return { error: null };
    } catch (error) {
        console.warn('deleteCheckmark server action Error: ', getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
}
