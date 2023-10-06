import { ReadonlyURLSearchParams } from 'next/navigation';
import secureLocalStorage from 'react-secure-storage';

// utility function to fetch data 
export async function fetcher<JSON = any>(
    input: RequestInfo,
    init?: RequestInit
): Promise<JSON> {
    const res = await fetch(input, init);

    if (!res.ok) {
        const json = await res.json();
        if (json.error) {
            const error = new Error(json.error) as Error & {
                status: number
            }
            error.status = res.status;
            throw error;
        } else {
            throw new Error(JSON.stringify(json));
        }
    }
    
    return res.json();
}


// utility function to create a URL, delete this one if not needed / used
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


// utility function to retrieve token from the local storage
export function getTokenFromStorage() {
    return secureLocalStorage.getItem('token') as string;
}

// utility function which removes the token from the local storage
export function removeTokenFromStorage() {
    secureLocalStorage.removeItem('token');
}

// utility function to chekc in the local storage if there is a present token
export const isAuthenticated = () => {
    let token = secureLocalStorage.getItem('token') as string;
    return token !== null;
}