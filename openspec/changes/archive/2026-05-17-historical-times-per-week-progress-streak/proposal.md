## Why

When a user changes a habit's `times per week` (or `times per month`) target, the progress bar and streak badge immediately retroactively reflect the new target across all past weeks — making previously-incomplete weeks appear complete and inflating streaks. This breaks historical fidelity: past weeks should always be evaluated against the target that was in effect at the time.

## What Changes

- The progress bar fill ratio for any viewed week/month SHALL be calculated using the `times` value that was active during that period, not the current live value.
- The streak badge count continues to come from the backend `streak` field on `HabitT`; streak correctness is fixed in the companion backend change.
- The `HabitT` type is extended with an optional `config_history` field — a lightweight list of `{ effective_from, times, time_frame }` entries provided by the backend.
- `computeHabitProgress` gains a private helper that resolves the historically-correct `times` for any given date using `config_history`.
- `computeMemberScore` is updated similarly if it uses `habit.times` as a denominator.

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `habit-progress-bar`: The requirement that the bar ratio uses `habit.times` (current live value) as denominator is replaced — the denominator MUST be the `times` value that was in effect during the viewed period, resolved from `config_history`.
- `habit-streak-indicator`: The requirement that a period counts toward the streak when checkmarks ≥ `habit.times` (current live value) is replaced — the threshold MUST be the `times` value in effect during each respective past period (backend-side fix; streak data still delivered via the `streak` field on `HabitT`).

## Impact

- `lib/types-and-constants.ts` — `HabitT` extended with optional `config_history` field.
- `lib/utils/compute-habit-progress.ts` — `computeHabitProgress` and `computeMemberScore` updated to resolve historical `times` via `config_history`.
- No component changes required; the fix is entirely in the utility layer.
- Depends on the backend change (companion PR) which adds `config_history` to the habit API response and fixes `_compute_streak()` to use historical targets.
