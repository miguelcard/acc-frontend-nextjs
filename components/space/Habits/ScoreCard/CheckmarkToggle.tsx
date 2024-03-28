import { HabitT } from '@/lib/types-and-constants';
import { format } from 'date-fns';
import { addCheckmark, deleteCheckmark } from '@/lib/actions';
import toast from 'react-hot-toast';

// ========================================================== Toggle the checkmark for a specific date
export const toggleCheckmark = async (
    date: Date,
    habit: HabitT,
    checkedDates: {
        [key: string]: number[];
    },
    setCheckedDates: React.Dispatch<
        React.SetStateAction<{
            [key: string]: number[];
        }>
    >
) => {
    const habitId = habit.id;
    const dateString = date.toDateString();
    const checkmark = habit.checkmarks.find((checkmark) => new Date(checkmark.date).toDateString() === dateString);
    const dateStr = format(date, 'yyyy-MM-dd');

    try {
        if (!checkedDates[dateString] || !checkedDates[dateString].includes(habitId)) {
            // Add checkmark
            const newCheckmark = { habit: habitId, status: 'DONE', date: dateStr };
            await toast.promise(
                addCheckmark(newCheckmark),
                {
                    loading: 'Updating',
                    success: (res) => {
                        setCheckedDates((prevCheckedDates) => ({
                            ...prevCheckedDates,
                            [dateString]: [...(prevCheckedDates[dateString] || []), habitId],
                        }));

                        return 'Added successfully';
                    },
                    error: (error: any) => 'Failed please try again.',
                },
                { duration: 1000 }
            );
        } else {
            // Remove checkmark
            await toast.promise(
                deleteCheckmark(checkmark),
                {
                    loading: 'Updating',
                    success: (res) => {
                        setCheckedDates((prevCheckedDates) => ({
                            ...prevCheckedDates,
                            [dateString]: prevCheckedDates[dateString].filter((id) => id !== habitId),
                        }));
                        return 'Removed successfully';
                    },
                    error: () => 'Failed please try again.',
                },
                { duration: 1000 }
            );
        }
    } catch (error) {
        console.log(`Error: ${error.message || 'Something went wrong. Please try again.'}`);
    }
};
