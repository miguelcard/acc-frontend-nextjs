import 'server-only';
import { getAuthCookie, getErrorMessage } from '@/lib/utils';
import { GENERIC_ERROR_MESSAGE } from '@/lib/types-and-constants';


interface Space {
  id: number;
  name: string;
  description?: string;
  tags?: string[];
  members_count?: number;
  habits_count?: number;
  space_habits?: any[]; // Todo change for habits type, any[] for now
  created_at?: string;
  updated_at?: string;
  creator?: number;
  members?: number[];
};


/**
 * Gets a Single Space by its ID
 * @param params id
 * @returns space
 */
async function getSpace(id: number) {
  const url = `${process.env.NEXT_PUBLIC_API}/v1/spaces/${id}`;
  const requestOptions: RequestInit = {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Cookie": `${getAuthCookie()}`,
    },
    cache: 'no-store'
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
    console.warn("An error ocurred: ", getErrorMessage(error));
    return { error: GENERIC_ERROR_MESSAGE };
  }
}


export default async function Space({ params }: { params: { id: number } }) {
  const { id } = params;
  const spaceResponse = await getSpace(id);

  if (spaceResponse.error) {
    // write an error message in the GUI manually or throw an error to be handled by next error boundry.
  }

  // Assigning a type to the response object
  const space: Space = spaceResponse;

  return (
    <div>
      This is the Space with ID: {space.id} <br />
      space name: {space.name} <br />
      space desc: {space.description} <br />
    </div>
  )
}