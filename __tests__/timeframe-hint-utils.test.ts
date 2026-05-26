import {
    buildPendingTransitionAlertMessage,
    buildTransitionSnackbarMessage,
    getPendingTransition,
    getTimeframeChangeHint,
} from '@/lib/utils/timeframe-hint-utils';
import { HabitT } from '@/lib/types-and-constants';

// ---------------------------------------------------------------------------
// Test helper: build a minimal HabitT for hint tests.
// config_history should be sorted ascending by effective_from.
// ---------------------------------------------------------------------------
function makeHabit(
    time_frame: string,
    times = 1,
    config_history?: HabitT['config_history'],
): HabitT {
    return {
        id: 1,
        title: 'Test habit',
        description: '',
        type: 'recurrent',
        times,
        time_frame,
        owner: 1,
        spaces: [1],
        tags: [],
        checkmarks: [],
        created_at: new Date('2026-01-01'),
        updated_at: new Date('2026-01-01'),
        config_history: config_history ?? [
            { effective_from: '2026-01-01', times, time_frame },
        ],
    };
}

// ---------------------------------------------------------------------------
// getTimeframeChangeHint
// ---------------------------------------------------------------------------

describe('getTimeframeChangeHint', () => {
    test('returns null when frames are the same (W→W)', () => {
        expect(getTimeframeChangeHint(makeHabit('W'), 'W', new Date('2026-05-15'))).toBeNull();
    });

    test('returns null when frames are the same (M→M)', () => {
        expect(getTimeframeChangeHint(makeHabit('M'), 'M', new Date('2026-05-15'))).toBeNull();
    });

    test('W→M on a non-1st day returns normal transition copy', () => {
        const result = getTimeframeChangeHint(makeHabit('W'), 'M', new Date('2026-05-15'));
        expect(result).toContain('Weekly tracking continues until end of May');
        expect(result).toContain('Monthly XP starts June 1');
        // Must NOT include the on-the-1st parenthetical clause
        expect(result).not.toContain('streak is preserved');
    });

    test('W→M on 1st May returns on-the-1st copy with streak notice', () => {
        const result = getTimeframeChangeHint(makeHabit('W'), 'M', new Date('2026-05-01'));
        expect(result).toContain('through all of May');
        expect(result).toContain('Monthly XP starts June 1');
        expect(result).toContain('streak is preserved through May');
    });

    test('W→M on 1st December correctly shows January in copy', () => {
        const result = getTimeframeChangeHint(makeHabit('W'), 'M', new Date('2026-12-01'));
        expect(result).toContain('through all of December');
        expect(result).toContain('Monthly XP starts January 1');
    });

    test('M→W returns static relative-language copy regardless of date', () => {
        const expected = 'Monthly tracking continues through this week. Weekly XP starts next week.';
        expect(getTimeframeChangeHint(makeHabit('M'), 'W', new Date('2026-05-21'))).toBe(expected);
        expect(getTimeframeChangeHint(makeHabit('M'), 'W', new Date('2026-05-24'))).toBe(expected); // Sunday
        expect(getTimeframeChangeHint(makeHabit('M'), 'W', new Date('2026-05-25'))).toBe(expected); // Monday
        expect(getTimeframeChangeHint(makeHabit('M'), 'W', new Date('2026-05-28'))).toBe(expected); // late-month
    });

    test('unrecognised combo returns null', () => {
        expect(getTimeframeChangeHint(makeHabit('W'), 'D', new Date('2026-05-15'))).toBeNull();
        expect(getTimeframeChangeHint(makeHabit('D'), 'W', new Date('2026-05-15'))).toBeNull();
    });

    test('returns null for M→W revert when W is still the currently-active frame', () => {
        // Simulate: originally W, changed to M (June 1 pending), reverted back to W.
        // config_history has W entry from Jan + a future M entry at June 1.
        // Today is May 25 → configForDate resolves to W (Jan entry).
        // activeFrame === newFrame ('W') → immediate revert, no hint.
        const habit = makeHabit('M', 3, [
            { effective_from: '2026-01-01', times: 3, time_frame: 'W' },
            { effective_from: '2026-06-01', times: 5, time_frame: 'M' },
        ]);
        expect(getTimeframeChangeHint(habit, 'W', new Date('2026-05-25'))).toBeNull();
    });

    test('shows M→W hint normally when M is genuinely the active frame', () => {
        // Habit has been M since April 1 — no pending future entry.
        const habit = makeHabit('M', 5, [
            { effective_from: '2026-01-01', times: 3, time_frame: 'W' },
            { effective_from: '2026-04-01', times: 5, time_frame: 'M' },
        ]);
        const result = getTimeframeChangeHint(habit, 'W', new Date('2026-05-25'));
        expect(result).toContain('Monthly tracking continues through this week');
    });
});

// ---------------------------------------------------------------------------
// buildTransitionSnackbarMessage
// ---------------------------------------------------------------------------

describe('buildTransitionSnackbarMessage', () => {
    test('W→M message names the last-weekly month and the new start date', () => {
        const result = buildTransitionSnackbarMessage({
            old_time_frame: 'W',
            new_time_frame: 'M',
            new_effective_from: '2026-06-01',
        });
        // Last weekly month is May (index 4 = month before June)
        expect(result).toContain('through end of May');
        expect(result).toContain('Monthly tracking begins June 1');
        expect(result).toContain('Habit updated');
    });

    test('M→W snackbar names the last-monthly Sunday and the start Monday', () => {
        const result = buildTransitionSnackbarMessage({
            old_time_frame: 'M',
            new_time_frame: 'W',
            new_effective_from: '2026-06-01',
        });
        expect(result).toContain('Habit updated');
        // effective_from is June 1 (Mon) → last monthly day is May 31 (Sun)
        expect(result).toContain('Sunday May 31');
        expect(result).toContain('Monday June 1');
        expect(result).not.toContain('Monthly tracking begins');
    });

    test('W→M January 1 correctly names December as last weekly month', () => {
        // Effective from 2027-01-01 means last weekly month is December 2026
        const result = buildTransitionSnackbarMessage({
            old_time_frame: 'W',
            new_time_frame: 'M',
            new_effective_from: '2027-01-01',
        });
        expect(result).toContain('through end of December');
        expect(result).toContain('Monthly tracking begins January 1');
    });

    test('W→M for a mid-year transition (July 1)', () => {
        const result = buildTransitionSnackbarMessage({
            old_time_frame: 'W',
            new_time_frame: 'M',
            new_effective_from: '2026-07-01',
        });
        expect(result).toContain('through end of June');
        expect(result).toContain('Monthly tracking begins July 1');
    });

    test('M→W snackbar uses exact API date (mid-month Monday)', () => {
        // effective_from = May 25 (Mon) → last monthly day = May 24 (Sun)
        const result = buildTransitionSnackbarMessage({
            old_time_frame: 'M',
            new_time_frame: 'W',
            new_effective_from: '2026-05-25',
        });
        expect(result).toContain('Sunday May 24');
        expect(result).toContain('Monday May 25');
    });
});

// ---------------------------------------------------------------------------
// getPendingTransition
// ---------------------------------------------------------------------------

describe('getPendingTransition', () => {
    test('returns null when config_history is empty', () => {
        const habit = makeHabit('W', 3, []);
        expect(getPendingTransition(habit, new Date('2026-05-25'))).toBeNull();
    });

    test('returns null when all entries are in the past or today', () => {
        const habit = makeHabit('W', 3, [
            { effective_from: '2026-01-01', times: 3, time_frame: 'W' },
            { effective_from: '2026-05-25', times: 3, time_frame: 'W' }, // today == not future
        ]);
        expect(getPendingTransition(habit, new Date(2026, 4, 25))).toBeNull();
    });

    test('returns the future entry when a pending W→M transition exists', () => {
        const habit = makeHabit('M', 3, [
            { effective_from: '2026-01-01', times: 3, time_frame: 'W' },
            { effective_from: '2026-06-01', times: 3, time_frame: 'M' },
        ]);
        const result = getPendingTransition(habit, new Date(2026, 4, 25));
        expect(result).not.toBeNull();
        expect(result?.effective_from).toBe('2026-06-01');
        expect(result?.time_frame).toBe('M');
    });

    test('returns the future entry when a pending M→W transition exists', () => {
        const habit = makeHabit('W', 5, [
            { effective_from: '2026-01-01', times: 5, time_frame: 'M' },
            { effective_from: '2026-06-02', times: 5, time_frame: 'W' },
        ]);
        const result = getPendingTransition(habit, new Date(2026, 4, 25));
        expect(result).not.toBeNull();
        expect(result?.effective_from).toBe('2026-06-02');
        expect(result?.time_frame).toBe('W');
    });

    test('today exactly equal to effective_from is NOT considered future', () => {
        const habit = makeHabit('M', 3, [
            { effective_from: '2026-01-01', times: 3, time_frame: 'W' },
            { effective_from: '2026-05-25', times: 3, time_frame: 'M' }, // exactly today
        ]);
        expect(getPendingTransition(habit, new Date(2026, 4, 25))).toBeNull();
    });

    test('uses local calendar date (not UTC) for the boundary check', () => {
        // Simulate a user in UTC+2: at 23:00 local on May 31, toISOString() would
        // give June 1 UTC, but the local date is still May 31.
        // We construct a Date that represents "May 31 local 23:00" by using the
        // local Date constructor, which is what the real call site does.
        const localMay31 = new Date(2026, 4, 31, 23, 0, 0); // month is 0-indexed
        const habit = makeHabit('M', 3, [
            { effective_from: '2026-01-01', times: 3, time_frame: 'W' },
            { effective_from: '2026-06-01', times: 3, time_frame: 'M' },
        ]);
        // June 1 entry is still in the future relative to local May 31 — must be returned.
        const result = getPendingTransition(habit, localMay31);
        expect(result).not.toBeNull();
        expect(result?.effective_from).toBe('2026-06-01');
    });
});

// ---------------------------------------------------------------------------
// buildPendingTransitionAlertMessage
// ---------------------------------------------------------------------------

describe('buildPendingTransitionAlertMessage', () => {
    test('W→M pending shows correct monthly goal and start date', () => {
        const result = buildPendingTransitionAlertMessage({
            effective_from: '2026-06-01',
            times: 3,
            time_frame: 'M',
        });
        expect(result).toContain('3x/month');
        expect(result).toContain('June 1, 2026');
        expect(result).toContain('weekly goal is still active');
        expect(result).not.toContain('monthly goal is still active');
    });

    test('M→W pending shows correct weekly goal and start date', () => {
        const result = buildPendingTransitionAlertMessage({
            effective_from: '2026-06-02',
            times: 5,
            time_frame: 'W',
        });
        expect(result).toContain('5x/week');
        expect(result).toContain('June 2, 2026');
        expect(result).toContain('monthly goal is still active');
        expect(result).not.toContain('weekly goal is still active');
    });

    test('correctly formats a January date (year boundary)', () => {
        const result = buildPendingTransitionAlertMessage({
            effective_from: '2027-01-01',
            times: 4,
            time_frame: 'M',
        });
        expect(result).toContain('January 1, 2027');
        expect(result).toContain('4x/month');
    });
});
