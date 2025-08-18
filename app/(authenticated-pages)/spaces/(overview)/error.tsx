'use client';

// if some error happens , you can catch the error in this page 
export default function Error({error, reset,}: {error: Error; reset: () => void;}) {
  return (
    <html>
      <body>
        <h2>Oops! Something went wrong: {error.message}</h2>
        <p>please reload the page and try again</p>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}