import { CheckedDatesT, HabitT } from '@/lib/types-and-constants';

/**
 * Returns the start of the week (Monday 00:00:00) containing `anchor`.
 */
function getWeekStart(anchor: Date): Date {
    const day = anchor.getDay(); // 0=Sun, 1=Mon...
    const diff = (day === 0 ? -6 : 1 - day); // shift to Monday
    const monday = new Date(anchor);
    monday.setDate(anchor.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
}

/**
 * Returns the start of the calendar month (1st 00:00:00) containing `anchor`.
 */
function getMonthStart(anchor: Date): Date {
    return new Date(anchor.getFullYear(), anchor.getMonth(), 1, 0, 0, 0, 0);
}

/**
 * Returns the last moment of the period (week or month) containing `anchor`.
 * - 'W': Sunday 23:59:59.999 of the week containing `anchor`
 * - 'M': Last day 23:59:59.999 of the month containing `anchor`
 * Used to resolve the historically-correct config for a whole period, so that a
 * config change mid-week/mid-month applies to the entire period it falls in.
 */
export function getPeriodEnd(anchor: Date, timeFrame: string): Date {
    if (timeFrame === 'M') {
        return new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0, 23, 59, 59, 999);
    }
    const weekStart = getWeekStart(anchor);
    const sunday = new Date(weekStart);
    sunday.setDate(weekStart.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    return sunday;
}

/**
 * Returns the historically-correct `{ times, time_frame }` for a given date by
 * consulting `config_history` (sorted ascending by effective_from).
 * Falls back to `habit.times` / `habit.time_frame` when the field is absent,
 * empty, or no entry predates `date`.
 */
export function configForDate(habit: HabitT, date: Date): { times: number; time_frame: string } {
    const history = habit.config_history;
    if (!history || history.length === 0) return { times: habit.times, time_frame: habit.time_frame };
    let result = { times: habit.times, time_frame: habit.time_frame };
    for (const entry of history) {
        if (new Date(entry.effective_from) <= date) {
            result = { times: entry.times, time_frame: entry.time_frame };
        } else {
            break;
        }
    }
    return result;
}

/**
 * Computes the completion ratio (0–1) for a single habit in the period that
 * contains `viewDate` (defaults to today when omitted).
 * - For time_frame "W": counts checkmarks in the Mon–Sun week of `viewDate`.
 * - For time_frame "M": counts checkmarks in the calendar month of `viewDate`.
 * Uses `config_history` to resolve the historically-correct target for the period,
 * so that changing `times` today does not retroactively distort past progress bars.
 * Capped at 1.0.
 */
export function computeHabitProgress(habit: HabitT, checkedDates: CheckedDatesT, viewDate?: Date): number {
    const anchor = viewDate ?? new Date();

    // Resolve config using the period END so that a mid-period config change
    // applies to the entire period it falls in (mirrors backend behaviour).
    const periodEnd = getPeriodEnd(anchor, habit.time_frame);
    const { times: requiredTimes } = configForDate(habit, periodEnd);
    if (!requiredTimes || requiredTimes <= 0) return 0;

    const periodStart = habit.time_frame === 'M' ? getMonthStart(anchor) : getWeekStart(anchor);

    let count = 0;
    for (const dateStr of Object.keys(checkedDates)) {
        const dateObj = new Date(dateStr);
        if (dateObj >= periodStart && dateObj <= periodEnd) {
            if (checkedDates[dateStr][habit.id]) {
                count++;
            }
        }
    }

    return Math.min(count / requiredTimes, 1);
}

/**
 * Computes the average completion score (0–1) for a member's habits.
 * Each habit is capped at 1.0 before averaging.
 * Pass `viewDate` to scope the calculation to the period containing that date.
 */
export function computeMemberScore(habits: HabitT[], checkedDates: CheckedDatesT, viewDate?: Date): number {
    if (!habits || habits.length === 0) return 0;
    const total = habits.reduce((sum, habit) => sum + computeHabitProgress(habit, checkedDates, viewDate), 0);
    return total / habits.length;
}

/**
 * Returns an MUI color token based on the progress ratio.
 * - 'error'   (red)    for progress < 0.35
 * - 'warning' (yellow) for 0.35 ≤ progress < 0.70
 * - 'success' (green)  for progress ≥ 0.70
 */
export function progressColor(ratio: number): 'error' | 'warning' | 'success' {
    if (ratio < 0.35) return 'error';
    if (ratio < 0.70) return 'warning';
    return 'success';
}

/**
 * Returns a CSS rgba color string that is a transparent-to-solid shade of #2dc38c.
 * - ratio 0   → very soft / transparent green (alpha ~0.18)
 * - ratio 1   → full #2dc38c (alpha 1.0)
 */
export function habitProgressGreen(ratio: number): string {
    const alpha = 0.08 + Math.min(ratio, 1) * 0.92;
    return `rgba(45, 195, 140, ${alpha.toFixed(2)})`;
}
