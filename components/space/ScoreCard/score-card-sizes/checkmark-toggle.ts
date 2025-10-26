import { CheckMarkT, CheckedDatesT, HabitT } from '@/lib/types-and-constants';
import { format } from 'date-fns';
import { addCheckmark, deleteCheckmark } from '@/lib/actions';
import toast from 'react-hot-toast';


/**
 * Add or delete a checkmark for a specific date of a specific habit. This function calls the server actions.
 * @param date 
 * @param habit 
 * @param checkmark 
 * @param setCheckedDates 
 * @returns 
 */
export const toggleCheckmark = async (
    date: Date,
    habit: HabitT,
    checkmark: CheckMarkT,
    setCheckedDates: React.Dispatch<React.SetStateAction<CheckedDatesT>>
) => {
    const habitId :number = habit.id;
    const dateString :string = date.toDateString();
    const formatedDateString: string = format(date, 'yyyy-MM-dd'); // this is just one of the dates shown in the fronted, it can be today or in the past.
    // Get current date in user's timezone. This is the actual current date in the user's timezone.
    const localDate: Date = new Date();
    // convert client date to UTC date for comparison in backend
    const currentUTCDate = localDate.toISOString().split('T')[0];

    try {
        if (Boolean(checkmark)) {
            // Remove checkmark api call
            const res: any = await deleteCheckmark(checkmark);

            // Error handling for api call and toast message for failure
            if (res.error) {
                toast.error('Failed please try again.', { duration: 1000 });
                return;
            }

            // State update for checkmark removal
            setCheckedDates((prevCheckedDates) => {
                const updatedCheckedDates = { ...prevCheckedDates };
                delete updatedCheckedDates[dateString][habitId];
                return { ...updatedCheckedDates };
            });

            // Toast message for checkmark removal success
            toast.success('Removed successfully', { duration: 1000 });
        } else {
            // Create new checkmark object to add to database
            const newCheckmark = { habit: habitId, status: 'DONE', date: formatedDateString, client_date: currentUTCDate };

            // Api call to add checkmark to database
            const res = await addCheckmark(newCheckmark);

            // Error handling for api call and toast message for failure
            if (res.error) {
                toast.error('Failed please try again.', { duration: 1000 });
                return;
            }

            // State update for checkmark addition
            setCheckedDates((prevCheckedDates) => {
                const updatedCheckedDates = { ...prevCheckedDates };

                if (!updatedCheckedDates[dateString]) {
                    updatedCheckedDates[dateString] = {};
                }
                updatedCheckedDates[dateString][habitId] = res;
                return { ...updatedCheckedDates };
            });

            // Toast message for checkmark addition success
            toast.success('Added successfully', { duration: 1000 });
        }
    } catch (error: any) {
        toast.error('Something went wrong. Please try again.', { duration: 1000 });
        console.log(`Error: ${error.message || 'Something went wrong. Please try again.'}`);
    }
};
