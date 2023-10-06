import { FormikProps } from "formik";

/**
 * Values to send in the signup form
 */
export interface FormValues {
    name: string;
    email: string;
    password: string;
    username: string;
}

/**
 * Initial values of the signup form
 */
export const initialValues : FormValues = {
    name: '',
    email: '',
    password: '',
    username: ''
}

/**
 * Fomik properties type
 */
export interface SignupFormProps {
    formik: FormikProps<FormValues>;
}