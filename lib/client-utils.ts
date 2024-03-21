import { HabitT } from './types-and-constants';

/**
 * @param endingDate is the refrance date from which the days of week are going to get created
 * @return dates and formetedays
 */
export const generateWeekDays = (endingDate: Date): Date[] => {
    // console.log('generateWeekDays called');

    const dates: Date[] = [];
    const currentDate = new Date(endingDate);
    currentDate.setHours(0, 0, 0, 0);

    const lastWeekStartDate = new Date(currentDate);
    lastWeekStartDate.setDate(lastWeekStartDate.getDate() - 6);

    while (currentDate >= lastWeekStartDate) {
        dates.push(new Date(lastWeekStartDate));
        lastWeekStartDate.setDate(lastWeekStartDate.getDate() + 1);
    }

    return dates;
};

export const checkedDatesMap = (habits: HabitT[]) => {
    // console.log('checkedDatesMap called');

    return habits.reduce(
        (mapedDates, habit) => {
            habit.checkmarks.forEach((checkmark) => {
                const date = new Date(checkmark.date);
                const dateString = date.toDateString();
                if (!mapedDates[dateString]) {
                    mapedDates[dateString] = [];
                }

                mapedDates[dateString].push(habit.id);
            });

            return mapedDates;
        },
        {} as { [key: string]: number[] }
    );
};

type CheckedDateItem = {
    id: number;
    date: string;
    habitId: number;
    checkmark: boolean;
};

// advance optimsed code currently in build process
const checkedDatesMap2 = (habits: HabitT[]) => {
    const allCheckedDates: { [date: string]: { [habitId: number]: CheckedDateItem } } = {};

    habits.forEach((habit) => {
        habit.checkmarks.forEach((checkmark) => {
            const date = new Date(checkmark.date);
            const dateString = date.toDateString();

            // Initialize the date object if it doesn't exist
            if (!allCheckedDates[dateString]) {
                allCheckedDates[dateString] = {};
            }

            // Create the CheckedDateItem for the habit
            const checkmarkStatus = checkmark.status === 'checked';
            const checkedDateItem: CheckedDateItem = {
                id: checkmark.id,
                date: checkmark.date,
                habitId: habit.id,
                checkmark: checkmarkStatus,
            };

            // Assign the CheckedDateItem to the corresponding habitId
            allCheckedDates[dateString][habit.id] = checkedDateItem;
        });
    });

    return allCheckedDates;
};

const toggleCheckmark2 = (
    dateString: string,
    habitId: number,
    setCheckedDates: React.Dispatch<
        React.SetStateAction<{
            [date: string]: {
                [habitId: number]: CheckedDateItem;
            };
        }>
    >
) => {
    setCheckedDates((prevCheckedDates) => {
        const updatedCheckedDates = { ...prevCheckedDates };

        if (!updatedCheckedDates[dateString]) {
            updatedCheckedDates[dateString] = {};
        }

        if (!updatedCheckedDates[dateString][habitId]) {
            updatedCheckedDates[dateString][habitId] = {
                id: -1,
                checkmark: true,
                date: dateString,
                habitId,
            };
        } else {
            delete updatedCheckedDates[dateString][habitId];
        }

        return { ...updatedCheckedDates };
    });
};
