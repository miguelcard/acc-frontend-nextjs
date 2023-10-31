'use client';

// if some error happens , you can catch the error in this page 
export default function Error({error, reset,}: {error: Error; reset: () => void;}) {
  return (
    <html>
      <body>
        <h2>TODO this is not showing when we get the error on the form submission! Something went wrong! Error: {error.message}</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}