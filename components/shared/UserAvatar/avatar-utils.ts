/**
 * Converts a string into a random color based on its hash value, 
 * this is used to color the picture avatars, when no profile picture is set.
 * @param string the string
 * @returns the color
 */
export function stringToColor(string: string):  string {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

/**
 * Takes the user's username, first name, last name and based on these, assigns a letter or two for its avatar 
 * as a fallback in case he does not have a profile picture
 * @param name the name of the user, can be null
 * @param lastName the lastName of the user, can be null
 * @param username its username
 * @returns A letter or 2 letters
 */
export function getLetter(name: string | null, username: string): string {
  if (name !== null) {
    return `${name.split(/\s+/)[0][0]}${name.split(/\s+/)[1]?.[0] ?? ''}`.toUpperCase();
  } else {
    return username[0].toUpperCase();
  }
}