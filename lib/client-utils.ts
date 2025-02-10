import { format } from 'date-fns';
import { CheckedDatesT, HabitT } from './types-and-constants';

/**
 * Takes a date no matter which date of the week it is, and returns the week from monday to sunday where this date belongs
 * @param date is the reference date from which the days of the week are going to get created
 * @return corresponding week dates
 */
export function generateWeekDays(arg0?: Date): Date[] {
    let date = arg0;
    date === undefined ? (date = new Date()) : (date = new Date(date));

    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

    const monday = new Date(date.setDate(diff));

    const weekDates: Date[] = [];
    for (let i = 0; i <= 6; i++) {
        const currentDate = new Date(monday);
        currentDate.setDate(currentDate.getDate() + i);
        weekDates.push(currentDate);
    }

    return weekDates;
}

/**
 * isWithinLast7Days checks is input date is within last 7 days of current date
 * @param date
 * @return boolean, true if date is within the last 7 days and false otherwise
 */
export function isWithinLast7Days(date: Date): boolean {
    const dateToCheck = new Date(date);
    const currentDate = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(currentDate.getDate() - 6);

    // Set hours, minutes, seconds, and milliseconds to 0 for both dates
    currentDate.setHours(0, 0, 0, 0);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    dateToCheck.setHours(0, 0, 0, 0);

    return (dateToCheck >= sevenDaysAgo && dateToCheck <= currentDate);
}

/**
 * createWeekUUID create unique code based on space between and weeks last date for adding it to the fetching sequence by default it is week based but in future we can make it mounth based or any other way as needed
 * @param spaceBetween number of dates you want to fetch
 * @param lastDate ending date for the fetching
 * @return unique week id
 */
export const createWeekUUID = (spaceBetween: number = -6, lastDate: Date | string = new Date()) => {
    const firstWeekDay = new Date(lastDate);
    firstWeekDay.setDate(firstWeekDay.getDate() + spaceBetween);

    const startDateStr = format(firstWeekDay, 'yyyy-MM-dd');
    const endDateStr = format(lastDate, 'yyyy-MM-dd');

    const weekUUID = `cm_from_date=${startDateStr}&cm_to_date=${endDateStr}`;
    return weekUUID;
};

export function parseDateString(queryString: string) {
    const params = new URLSearchParams(queryString);
    let result = {
        cm_from_date: params.get('cm_from_date'),
        cm_to_date: params.get('cm_to_date'),
    };
    return result;
}

/**
 * If the string is bigger than the max length, the string is cut and the threee dots are added at the end
 * If the string is not bigger than the maxt length, then just returns the string
 */
export const setMaxStringLength = (text: string, maxLength: number): string => {
    if (text !== undefined) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
    return text;
};

/**
 * @param habits
 * @return CheckedDatesT which is an object of all the date of the checked dates
 */
export const checkedDatesMap = (habits: HabitT[]) => {
    const allCheckedDates: CheckedDatesT = {};

    habits.forEach((habit) => {
        habit.checkmarks.forEach((checkmark) => {
            const date = new Date(checkmark.date);
            const dateString = date.toDateString();

            // Initialize the date object if it doesn't exist
            if (!allCheckedDates[dateString]) {
                allCheckedDates[dateString] = {};
            }

            // Assign the CheckedDateItem to the corresponding habitId
            allCheckedDates[dateString][habit.id] = checkmark;
        });
    });
    return allCheckedDates;
};
