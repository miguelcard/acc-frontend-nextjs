import 'server-only';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { cookies } from 'next/headers';
// import { format } from 'date-fns';

/**
 * Utility function to fetch data
 * @param input path
 * @param init request options
 * @returns JSON formated response body
 */
export async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
    const res: Response = await fetch(input, init);
    if (!res.ok) {
        const json = await res.json();
        if (json.error) {
            const error = new Error(json.error) as Error & {
                status: number;
            };
            error.status = res.status;
            throw error;
        } else {
            throw new Error(JSON.stringify(json));
        }
    }

    return await res.json();
}

/**
 * Takes the cookie from a response and sets the cookie in the backend and also sets it to the client (browser)
 * @param authToken
 */
export const setAuthCookie = (res: Response): void => {
    const cookie = require('cookie');
    const authToken: string = cookie.parse(
        res.headers.getSetCookie().find((c) => c.startsWith('auth_token')) || 'token not found'
    ).auth_token;

    if (authToken === undefined) {
        console.warn('Token was not found in the response cookie!');
        return;
    }

    //This also sets the 'Set-Cookie' automatically to the client, but if we need to send it from client components we have to enable CORS in the backend
    cookies().set({
        name: 'auth_token',
        value: authToken,
        httpOnly: true,
        path: '/',
        domain: '.localhost', // put enviroment variable here
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 60 * 24 * 5, // seconds
        // sameSite: "strict",
    });
};

/**
 * Retrieves the authentication token from the cookie and serializes it in a string to be able to send it in a header
 */
export const getAuthCookie = (): string => {
    const authCookie = cookies().get('auth_token');
    if (authCookie === undefined) {
        console.info('Authentication cookie is undefined');
        return '';
    }

    const cookie = require('cookie');
    const serializedAuthCookie = `${cookie.serialize(
        authCookie?.name,
        authCookie?.value
        // {other cookie options}
    )}`;

    return serializedAuthCookie;
};

/**
 * Utility function to create a URL, delete this one if not needed / used
 */
export const createUrl = (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) => {
    const paramsString = params.toString();
    const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

    return `${pathname}${queryString}`;
};

/**
 * Helper function to check if a string is a JSON object
 * @returns true or false
 */
export function isJsonString(str: string): boolean {
    try {
        const parsedJson = JSON.parse(str);
        return typeof parsedJson === 'object' && parsedJson !== null;
    } catch (e) {
        return false;
    }
}

/**
 * Extracts the error message from different possible types of errors, useful when catching errors
 * @param error message
 */
export const getErrorMessage = (error: unknown): string => {
    let message: string;

    if (error instanceof Error) {
        message = error.message;
    } else if (error && typeof error === 'object') {
        if ('message' in error) {
            message = String(error.message);
        } else if ('detail' in error) {
            message = String(error.detail);
        } else {
            message = 'Something went wrong';
        }
    } else if (typeof error === 'string') {
        message = error;
    } else {
        message = 'Something went wrong';
    }

    return message;
};

/**
 * If the string is bigger than the max length, the string is cut and the threee dots are added at the end
 * If the string is not bigger than the maxt length, then just returns the string
 */
export const setMaxStringLength = (text: string, maxLength: number): string => {
    if (text !== undefined) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
    return text;
};

type FormBodyObject = {
    [key: string]: FormDataEntryValue;
};
/**
 * Helper function to turn a formData object to a request body object
 */
export const formDataToReqBody = (formData: FormData): FormBodyObject => {
    const reqBody: FormBodyObject = {};
    formData.forEach((value, key) => (reqBody[key] = value));
    return reqBody;
};
