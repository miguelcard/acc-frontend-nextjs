import { HabitT } from '@/lib/types-and-constants';
import { configForDate } from '@/lib/utils/compute-habit-progress';

export const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Returns a human-readable inline hint string (pre-save) when the user is about
 * to change the time_frame in the EditHabit form. Returns null when no hint is
 * needed (direction unchanged, unrecognised combo, or the change is an immediate
 * revert of a pending future transition — e.g. W→M was saved but the month
 * hasn't started yet, so changing back to W applies immediately with no gap).
 *
 * The "immediate revert" case is detected by resolving the config that is
 * currently active today via configForDate: if the active time_frame already
 * equals newFrame, the backend will apply the change immediately (no deferral)
 * so no transitional hint is appropriate.
 *
 * The post-save snackbar uses the authoritative server date instead of
 * recalculating here, so no date arithmetic is needed for M→W in this function.
 */
export function getTimeframeChangeHint(
    habit: HabitT,
    newFrame: string,
    today: Date,
): string | null {
    const oldFrame = habit.time_frame;
    if (oldFrame === newFrame) return null;

    // Resolve what config is genuinely active today (not just the live field).
    // If a pending future transition exists (e.g. a W→M entry at June 1 that
    // hasn't kicked in yet), the currently-active frame is still W.  Changing
    // back to W in that case is an immediate revert — no hint needed.
    const { time_frame: activeFrame } = configForDate(habit, today);
    if (activeFrame === newFrame) return null;

    const monthName = MONTH_NAMES[today.getMonth()];
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const nextMonthName = MONTH_NAMES[nextMonth.getMonth()];

    if (oldFrame === 'W' && newFrame === 'M') {
        if (today.getDate() === 1) {
            return (
                `Weekly tracking continues through all of ${monthName}. ` +
                `Monthly XP starts ${nextMonthName} 1.`
            );
        }
        return (
            `Weekly tracking continues until end of ${monthName}. ` +
            `Monthly XP starts ${nextMonthName} 1.`
        );
    }

    if (oldFrame === 'M' && newFrame === 'W') {
        return `Monthly tracking continues through this week. Weekly XP starts next week.`;
    }

    return null;
}

/**
 * Returns a warning string when changing time_frame would reset an active streak,
 * so the user can be informed before saving. Returns null when there is no streak
 * or the time_frame is not actually changing.
 */
export function getStreakResetWarning(
    habit: HabitT,
    newFrame: string,
): string | null {
    if (habit.time_frame === newFrame) return null;
    const count = habit.streak?.count ?? 0;
    if (count <= 0) return null;

    const unit = habit.streak!.unit === 'M' ? 'm' : 'w';
    const label = unit === 'm' ? 'monthly' : 'weekly';
    const newLabel = newFrame === 'M' ? 'monthly' : 'weekly';
    return (
        `Your current ${label} streak (\uD83D\uDD25 ${count}${unit}) will reset when switching to ${newLabel}.`
    );
}

/**
 * Returns the first config_history entry whose effective_from is strictly in
 * the future (after today), representing a saved-but-not-yet-active timeframe
 * transition.  Returns null when no such entry exists.
 *
 * config_history is expected to be sorted ascending by effective_from (as the
 * backend always returns it).  We use a simple string compare against the ISO
 * date because YYYY-MM-DD lexicographic order equals chronological order.
 */
export function getPendingTransition(
    habit: HabitT,
    today: Date,
): { effective_from: string; times: number; time_frame: string } | null {
    if (!habit.config_history?.length) return null;
    // Use local calendar date (not UTC) so the boundary aligns with how the
    // backend anchors period starts — midnight in the user's local timezone.
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    const todayStr = `${y}-${m}-${d}`;
    return habit.config_history.find(c => c.effective_from > todayStr) ?? null;
}

/**
 * Builds the informational alert message shown inside the edit modal when a
 * saved timeframe transition is pending (the new frame hasn't started yet).
 * The pending entry's time_frame tells us the incoming frame; the "old" frame
 * is inferred from context (opposite of new).
 */
export function buildPendingTransitionAlertMessage(
    pending: { effective_from: string; times: number; time_frame: string },
): string {
    const d = new Date(`${pending.effective_from}T00:00:00`);
    const dateStr = `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

    if (pending.time_frame === 'M') {
        return (
            `Your new monthly goal (${pending.times}x/month) begins ${dateStr}. ` +
            `Until then, your weekly goal is still active.`
        );
    }
    return (
        `Your new weekly goal (${pending.times}x/week) begins ${dateStr}. ` +
        `Until then, your monthly goal is still active.`
    );
}

/**
 * Builds the post-save snackbar message from the API's config_transition object.
 * Uses the authoritative server date rather than recalculating client-side.
 *
 * Input: the config_transition field that the PATCH response includes when
 * time_frame changed.  new_effective_from is an ISO date string "YYYY-MM-DD".
 */
export function buildTransitionSnackbarMessage(
    ct: NonNullable<HabitT['config_transition']>,
): string {
    // Parse as local midnight to avoid UTC boundary shifts.
    const d = new Date(`${ct.new_effective_from}T00:00:00`);
    const formatted = `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;

    if (ct.old_time_frame === 'W' && ct.new_time_frame === 'M') {
        // The month BEFORE new_effective_from is the last weekly month.
        const endMonthIdx = d.getMonth() === 0 ? 11 : d.getMonth() - 1;
        const endMonthName = MONTH_NAMES[endMonthIdx];
        return (
            `Habit updated. Weekly tracking runs through end of ${endMonthName}. ` +
            `Monthly tracking begins ${formatted}.`
        );
    }

    // M → W: also show the last day of monthly tracking (Sunday before effective_from).
    const prevDay = new Date(d);
    prevDay.setDate(d.getDate() - 1);
    const lastMonthlyStr = `${MONTH_NAMES[prevDay.getMonth()]} ${prevDay.getDate()}`;
    return `Habit updated. Monthly tracking ends Sunday ${lastMonthlyStr}. Weekly tracking begins Monday ${formatted}.`;
}
