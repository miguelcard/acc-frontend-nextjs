## Why

When a user changes a habit's `time_frame` (e.g. Weekly → Monthly), the UI saves silently with no explanation of what just happened. The user has no idea that their old rule continues through end of the current period, when the new rule actually starts, or that there was previously a dead zone where no XP could be earned. This creates confusion, distrust, and potentially a feeling that progress was lost.

## What Changes

- **Inline hint in the Edit Habit form**: When the user selects a different `time_frame` in the dropdown (before saving), an informational alert appears below the selector explaining when the new rule will take effect. The hint is computed client-side from the selected values and today's date, with no extra API calls.
- **Post-save snackbar**: After a successful PATCH that changes `time_frame`, a snackbar appears confirming the change and showing the exact transition date sourced from the `config_transition` field in the API response.
- **`HabitT` type extended with `config_transition`**: A new optional field on `HabitT` (and the mutation response) carries `{ old_time_frame, new_time_frame, new_effective_from }` from the backend when a time_frame PATCH was made.

## Capabilities

### New Capabilities

- `habit-timeframe-change-feedback`: Inline hint and post-save snackbar feedback when the user changes a habit's time_frame.

### Modified Capabilities

_(none — no existing spec-level requirements change)_

## Impact

- `lib/types-and-constants.ts` — extend `HabitT` with optional `config_transition` field.
- `components/space/ScoreCard/score-card-sizes/HabitOptionsMenu/edit-habit.tsx` — add inline `Alert` that reacts to Formik `values.time_frame` change; add snackbar trigger after successful mutation.
- `lib/hooks/mutations.ts` or `lib/fetch-mutations.ts` — ensure `patchHabit` mutation returns the full response including `config_transition`.
- `components/shared/` — may reuse an existing Snackbar/toast component if one exists, otherwise a simple MUI `Snackbar` inline in `EditHabit`.
