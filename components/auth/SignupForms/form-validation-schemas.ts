import { checkUsernameOrEmailExist } from '@/lib/actions';
import * as Yup from 'yup';

const signupValidationSchemas = [
    Yup.object().shape({
        name: Yup
            .string()
            .required('Name is required'),
        email: Yup
            .string()
            .email('Enter a valid email')
            .required('Email is required')
            .test('unique', 'Email address is already taken', async function (value) {
                const isEmailTaken: boolean = await checkIfEmailIsTaken(value);
                return !isEmailTaken;
            }),
        password: Yup
            .string()
            .min(8, 'Password should be of minimum 8 characters length')
            .required('Password is required'),
    }),
    Yup.object().shape({
        username: Yup
            .string()
            .required('username is required')
            .min(3, 'Username must be at least 3 characters')
            .max(20, 'Username must be at most 20 characters')
            .matches(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, dashes, and underscores')
            .test('unique', 'Username is already taken', async function (value) {
                const isUsernameTaken: boolean = await checkIfUsernameIsTaken(value);
                return !isUsernameTaken;
            })
    })
];

/**
 * checks in the backend if the email is already taken
 * @param email 
 * @returns true or false
 */
const checkIfEmailIsTaken = async (email: string): Promise<boolean> => {
    const exists = await checkUsernameOrEmailExist(null, email);
    const isTaken: boolean = exists.email_taken;
    return isTaken;
};

/**
 * checks in the backend if the username is already taken
 * @param username 
 * @returns true or false
 */
const checkIfUsernameIsTaken = async (username: string): Promise<boolean> => {
    const exists = await checkUsernameOrEmailExist(username, null);
    const isTaken: boolean = exists.username_taken;
    return isTaken;
};


export default signupValidationSchemas;