/** Suffix of the placeholder email the backend assigns to anonymous (guest) Firebase users. */
const ANONYMOUS_EMAIL_SUFFIX = '@anonymous.firebase';

/**
 * Returns the email only if it is a real one the user would recognise.
 * Guests have a generated placeholder (`<random>@anonymous.firebase`), which is meaningless to show.
 */
export function getDisplayEmail(email: string | null | undefined): string | null {
    if (!email || email.toLowerCase().endsWith(ANONYMOUS_EMAIL_SUFFIX)) return null;
    return email;
}
