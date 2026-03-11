import { ReadonlyURLSearchParams } from 'next/navigation';
import { getIdToken } from '@/lib/auth/firebase-auth';

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
 * Returns an Authorization header object with the Firebase ID token.
 * Used by all API calls to authenticate with the backend.
 * @returns header object with Authorization Bearer token
 */
export const getAuthHeader = async (): Promise<Record<string, string>> => {
    const token = await getIdToken();
    if (!token) {
        console.warn('No Firebase ID token available — user may not be signed in');
        return {};
    }
    return { Authorization: `Bearer ${token}` };
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

/** @deprecated
 * Extracts the error message from different possible types of errors, useful when catching errors
 * @param error message
 * TODO this is not such a good practice, a better practice would be to send specific error codes from
 * the backend response like LIMIT_CREATED_SPACES and just map those errors to the front end and let the 
 * frontend handle the specific messages for those standard errors.
 * Then we wouldn't neeed the extractCustomErrorMessageIfExists() method either
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
        } else if ('errors' in error) {
            message = JSON.stringify(error.errors);
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


type ApiError = {
  status: number;
  detail: string;
  error?: {
    code: string;
    meta?: Record<string, any>;
  };
};

/**
 * Maps the standard error message codes that come from the backend, to custom messages to be shown to the client in the frontend. 
 * this decouples the backend from the frontend and supports future translations as well 
 * @param errorResponse 
 * @returns 
 */
export const getApiErrorMessage = (errorResponse: ApiError): string => {
    const code = errorResponse.error?.code;
    const metaData = errorResponse.error?.meta || {};

    // map the error code to the corresponding message
    switch (code?.toUpperCase()) {
        case 'FREE_GROUP_CREATE_LIMIT_REACHED':
            return `You can create up to ${metaData.limit} groups in the first version of the app. You currently have ${metaData.current} created groups.`;
        case 'FREE_GROUP_JOIN_LIMIT_REACHED':
            return `The user ${metaData.username} already belongs to a maximum of ${metaData.limit} groups.`;
        case 'FREE_HABIT_CREATE_LIMIT_REACHED':
            return `You have already reached the maximum amount of ${metaData.limit} habits that each user can create in this space.`;
        default:
            return 'Something went wrong. Please refresh the page or try again.';
    }
}


/**
 * @deprecated This method is no longer recommended. Use `getApiErrorMessage` instead.
 *  Returns the error message based on my backend object i.e. this form of object: {"errors":{"creator":["User may not create more than 2 spaces."]}
 * @param errorResponse the http response
 */
export const extractCustomErrorMessageIfExists = (errorResp: any): string | undefined => {
    // extracts the first error shown under errors object
    if (errorResp && errorResp.errors && Object.keys(errorResp.errors).length > 0) {
        const errorKey: string = Object.keys(errorResp.errors)[0];
        const errorMessage: string = errorResp.errors[errorKey][0];
        return errorMessage 
    } else if(errorResp && errorResp.error) {
        return errorResp.error;
    }
    return undefined;
}

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
