'use server';
import 'server-only';
import { revalidatePath } from "next/cache";
import { getAuthCookie, getErrorMessage, setAuthCookie } from "./utils";
import { FormikValues } from "formik";
import { GENERIC_ERROR_MESSAGE } from './types-and-constants';

// for now all server actions will be included here, later we can opt out for more modularity, i.e. separating them in different files.
type FormBodyObject = {
  [key: string]: FormDataEntryValue
};

const API = process.env.NEXT_PUBLIC_API;

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
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  };

  try {
    const res: Response = await fetch(loginUrl, requestOptions);

    if (String(res.status)[0] === '4') { // if error code begins with 4
      return { error: 'email or password are incorrect' };
    }

    if (!res.ok) {
      const errorResp = await res.json();
      console.warn('Login server action Error: ' + getErrorMessage(errorResp));
      console.warn(JSON.stringify(errorResp));
      return { error: GENERIC_ERROR_MESSAGE };
    }

    setAuthCookie(res);
    return await res.json();

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
      "Content-Type": "application/json",
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
      "Content-Type": "application/json",
      'Cookie': `${getAuthCookie()}`,
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
 * Helper function to turn a formData object to a request body object
 */
const formDataToReqBody = (formData: FormData): FormBodyObject => {
  const reqBody: FormBodyObject = {};
  formData.forEach((value, key) => reqBody[key] = value);
  return reqBody;
}