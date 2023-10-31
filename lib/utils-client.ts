
import secureLocalStorage from 'react-secure-storage';

// This script is to define utility functions which are to be used ONLY for client components


// TODO: delete all local storage things once not used anymore
// set token to local storage 
export function setTokenToStorage(token: string) {
    secureLocalStorage.setItem('token', token);
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