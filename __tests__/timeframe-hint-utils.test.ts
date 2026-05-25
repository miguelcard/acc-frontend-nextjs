import {
    buildTransitionSnackbarMessage,
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
