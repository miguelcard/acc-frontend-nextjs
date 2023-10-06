'use server'

import { revalidatePath } from "next/cache";
import { fetcher, isJsonString } from "./utils";

// for now all server actions will be included here, later we can opt out for more modularity, i.e. separating them in different files.
type FormBodyObject = {
  [key: string]: FormDataEntryValue
};

const API = process.env.NEXT_PUBLIC_API;

/**
 * Calls login api with the data sent in the form
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
    const responseData = await fetcher(loginUrl, requestOptions);
      // revalidatePath('/login') // necessary? I think so, test
    return responseData;
  } catch (error: any) {
    if (isJsonString(error.message)) {
      const res = JSON.parse(error.message);
      console.warn(res.non_field_errors);
      return res.non_field_errors; // in case we want to show them to the client
    } else {
      console.warn(error.message);
      return error.message;
    }
  }
}

/**
 * Calls sign up api with the data sent in the form
 * @param formData 
 * @returns 
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
    const responseData = await fetcher(signupUrl, requestOptions);
    //   revalidatePath('/signup') // necessary? I think so, test
    return responseData;
  } catch (error: any) {
    if (isJsonString(error.message)) {
      const res = JSON.parse(error.message);
      console.warn(res.non_field_errors);
      return res.non_field_errors; // in case we want to show them to the client
    } else {
      console.warn(error.message);
      return error.message;
    }
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