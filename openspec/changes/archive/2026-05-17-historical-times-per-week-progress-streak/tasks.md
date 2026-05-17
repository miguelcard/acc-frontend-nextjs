## 1. Extend HabitT type

- [x] 1.1 In `lib/types-and-constants.ts`, added optional field to `HabitT`: `config_history?: { effective_from: string; times: number; time_frame: string }[]`

## 2. Add historical times resolver to compute-habit-progress.ts

- [x] 2.1 Added private helper `_timesForDate(habit: HabitT, date: Date): number` that iterates `config_history` (sorted ascending) from start and returns the `times` from the latest entry whose `effective_from` ≤ `date`, falling back to `habit.times` if `config_history` is absent or empty.
- [x] 2.2 Updated `computeHabitProgress` to replace the `habit.times` denominator with `_timesForDate(habit, anchor)` where `anchor` is `viewDate ?? new Date()`.
- [x] 2.3 `computeMemberScore` delegates to `computeHabitProgress` — no changes needed, automatically benefits from the fix.

## 3. Verify correctness manually

- [x] 3.1 Confirm that navigating to a past week where `times` was higher shows a lower (correct) progress ratio, not inflated to current target
- [x] 3.2 Confirm that the current week's progress bar still works correctly with the current target
- [x] 3.3 Confirm that a habit without `config_history` (field absent) falls back gracefully with no errors and behaves as before
