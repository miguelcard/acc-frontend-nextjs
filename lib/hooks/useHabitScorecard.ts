import { useState, useMemo, useCallback } from 'react';
import { CheckedDatesT, HabitT } from '@/lib/types-and-constants';
import { checkedDatesMap, createWeekUUID, generateWeekDays } from '@/lib/client-utils';

/**
 * Custom hook to manage habit scorecard state and logic
 * Shared between ScoreCard and AllUserHabitsView components
 * 
 * At the end returns object with various functions that depend on states
 */
export function useHabitScorecard(initialHabits: HabitT[]) {
    // ============================= States initialization preparation
    const weekDays = useMemo(() => generateWeekDays(), []);
    const todayUUID = useMemo(() => createWeekUUID(), []);
    const newCheckedDates = useCallback((habits: HabitT[]) => checkedDatesMap(habits), []);

    // ============================= States declaration and initialization
    const [dates, setDates] = useState(weekDays);
    const [checkedDates, setCheckedDates] = useState<CheckedDatesT>(newCheckedDates(initialHabits));
    const [datesFetched, setDatesFetched] = useState([todayUUID]);

    // ============================= Update checked dates for date range pagination
    /**
     * @param dateRangeCode string containing cm_to_date and cm_from_date for checkmarks pagination
     * @param fetchFn async function that fetches habits for the given date range
     */
    const updateCheckedDates = useCallback(
        async (dateRangeCode: string, fetchFn: (dateRangeCode: string) => Promise<HabitT[]>) => {
            if (!datesFetched.includes(dateRangeCode)) {
                const newHabits = await fetchFn(dateRangeCode);
                setDatesFetched((prev) => [...prev, dateRangeCode]);

                const fetchedCheckedDates = checkedDatesMap(newHabits);
                setCheckedDates((prev) => ({ ...prev, ...fetchedCheckedDates }));
            }
        },
        [datesFetched]
    );

    return {
        dates,
        setDates,
        checkedDates,
        setCheckedDates,
        updateCheckedDates,
    };
}