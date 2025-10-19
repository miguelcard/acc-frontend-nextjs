import {getRequestConfig} from 'next-intl/server';
 
/**
 * next-intl creates a request-scoped configuration object, which you can use to provide messages and other options based on the user’s locale to Server Components.
 */
export default getRequestConfig(async () => {
  // Static for now, we'll change this later
  const locale = 'en';
 
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});