import React from 'react'

/**
 * content fetched within the generateStaticParams function using a fetch request, will automatically memoize the requests.
 * see: https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
 * @returns a list of `params` to populate the [id] dynamic segment
 */
export async function generateStaticParams() {

  const url = `${process.env.NEXT_PUBLIC_API}/v1/spaces/?page_size=20`;
  const requestOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      // "Authorization": `token ${token}`,
    },
  };

  const spaces = await fetch(url, requestOptions).then((res) => res.json());
 
  return spaces.map((space : any) => ({
    id: space.id, // here you could pass the whole space already
  }));
}

// Multiple versions of this page will be statically generated
// using the `params` returned by `generateStaticParams`
export default function Space({ params }: { params: { id: number } }) {
  const { id } = params;


  return (
    <div>This is the Space with ID: {params.id}</div>
  )
}