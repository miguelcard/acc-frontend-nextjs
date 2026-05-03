import { CheckedDatesT, HabitT } from '@/lib/types-and-constants';

/**
 * Returns the start of the current week (Monday 00:00:00).
 */
function getWeekStart(): Date {
    const now = new Date();
    const day = now.getDay(); // 0=Sun, 1=Mon...
    const diff = (day === 0 ? -6 : 1 - day); // shift to Monday
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
}

/**
 * Returns the start of the current calendar month (1st 00:00:00).
 */
function getMonthStart(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
}

/**
 * Computes the completion ratio (0–1) for a single habit in its current period.
 * - For time_frame "W": counts checkmarks in the current Mon–Sun week.
 * - For time_frame "M": counts checkmarks in the current calendar month.
 * Capped at 1.0.
 */
export function computeHabitProgress(habit: HabitT, checkedDates: CheckedDatesT): number {
    if (!habit.times || habit.times <= 0) return 0;

    const periodStart = habit.time_frame === 'M' ? getMonthStart() : getWeekStart();
    const now = new Date();

    let count = 0;
    for (const dateStr of Object.keys(checkedDates)) {
        const dateObj = new Date(dateStr);
        if (dateObj >= periodStart && dateObj <= now) {
            if (checkedDates[dateStr][habit.id]) {
                count++;
            }
        }
    }

    return Math.min(count / habit.times, 1);
}

/**
 * Computes the average completion score (0–1) for a member's habits.
 * Each habit is capped at 1.0 before averaging.
 */
export function computeMemberScore(habits: HabitT[], checkedDates: CheckedDatesT): number {
    if (!habits || habits.length === 0) return 0;
    const total = habits.reduce((sum, habit) => sum + computeHabitProgress(habit, checkedDates), 0);
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
