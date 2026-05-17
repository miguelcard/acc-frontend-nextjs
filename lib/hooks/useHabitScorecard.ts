import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { CheckedDatesT, HabitT } from '@/lib/types-and-constants';
import { checkedDatesMap, createWeekUUID, generateWeekDays, isWithinLast7Days } from '@/lib/client-utils';

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

    // ============================= Sync checkedDates when a background refetch brings fresh server data
    //
    // Problem this solves: when a component mounts with stale cached habits (because a checkmark was
    // added from a different page since the last fetch), useState only reads `initialHabits` once.
    // When the background refetch completes and the parent re-renders with fresh `initialHabits`,
    // `checkedDates` would stay stale. This effect merges the new server data in.
    //
    // Merge strategy: shallow-merge at the date level so that past weeks fetched via
    // `updateCheckedDates` (date-range pagination) are preserved, while the current
    // server data takes precedence for any date it covers.
    const prevHabitsRef = useRef<HabitT[]>(initialHabits);
    useEffect(() => {
        if (prevHabitsRef.current !== initialHabits) {
            prevHabitsRef.current = initialHabits;
            const fresh = checkedDatesMap(initialHabits);
            // Build the set of habit IDs whose checkmarks are being refreshed.
            const refreshedHabitIds = new Set(initialHabits.map(h => String(h.id)));
            setCheckedDates(prev => {
                // Strip every (date → habitId) entry that belongs to a refreshed habit.
                // Without this, removed checkmarks linger in `prev` because
                // checkedDatesMap only emits dates that *have* checkmarks — it never
                // emits an empty entry to signal "nothing here any more".
                const cleaned: CheckedDatesT = {};
                for (const [date, habitsForDate] of Object.entries(prev)) {
                    // Only clean dates within the current 7-day window — that's what
                    // initialHabits actually covers. Past-week pagination data falls
                    // outside this window and must be preserved as-is; wiping it would
                    // make past checkmarks disappear after a mutation triggers a refetch.
                    if (!isWithinLast7Days(new Date(date))) {
                        cleaned[date] = habitsForDate;
                        continue;
                    }
                    const kept = Object.fromEntries(
                        Object.entries(habitsForDate).filter(([hId]) => !refreshedHabitIds.has(hId))
                    );
                    if (Object.keys(kept).length > 0) {
                        cleaned[date] = kept;
                    }
                }
                // Re-add exactly what the server returned for these habits.
                for (const [date, habitsForDate] of Object.entries(fresh)) {
                    cleaned[date] = { ...(cleaned[date] ?? {}), ...habitsForDate };
                }
                return cleaned;
            });
        }
    }, [initialHabits]);

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