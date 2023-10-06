'use client';

// if some error happens , you can catch the error in this page 
export default function Error({error, reset,}: {error: Error; reset: () => void;}) {
  return (
    <html>
      <body>
        <h2>Something went wrong! Error: {error.message}</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}