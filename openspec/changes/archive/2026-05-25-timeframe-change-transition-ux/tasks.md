## 1. Type extension

- [x] 1.1 In `lib/types-and-constants.ts`, add optional `config_transition?: { old_time_frame: 'W' | 'M'; new_time_frame: 'W' | 'M'; new_effective_from: string }` to `HabitT`.

## 2. Inline hint in EditHabit form

- [x] 2.1 In `components/space/ScoreCard/score-card-sizes/HabitOptionsMenu/edit-habit.tsx`, import MUI `Alert`.
- [x] 2.2 Add a helper function (inline or in a utils file) `getTimeframeChangeHint(oldFrame: string, newFrame: string, today: Date): string | null` that returns the appropriate hint string or `null` when no hint is needed. Implement the W→M, W→M-on-1st, and M→W cases as described in the design.
- [x] 2.3 In the form step containing the `time_frame` field, use Formik's `values.time_frame` to conditionally render an `<Alert severity="info">` below the time_frame `Field` when `values.time_frame !== habit.time_frame`.
- [x] 2.4 Verify the alert disappears when the user reverts the dropdown to the original value.

## 3. Post-save snackbar

- [x] 3.1 Import `CustomSnackbar` from `@/components/shared/Snackbar/snackbar` in `edit-habit.tsx`.
- [x] 3.2 Add `useState<string | null>(null)` for `snackbarMessage` local state.
- [x] 3.3 In `submitEditHabit`, after `mutateAsync` resolves successfully, check if `updatedHabit.config_transition` is present. If so, build the appropriate snackbar message string using `config_transition.old_time_frame`, `config_transition.new_time_frame`, and `config_transition.new_effective_from` (format the date as "Month D", e.g. "June 1").
- [x] 3.4 Call `setSnackbarMessage(...)` before calling `handleCloseDialog?.()` so the message is set while the component is still mounted.
- [x] 3.5 Render `<CustomSnackbar>` in the `EditHabit` return, passing `isOpen={!!snackbarMessage}`, `message={snackbarMessage ?? ''}`, and `handleCloseToast={() => setSnackbarMessage(null)}`.
- [x] 3.6 Verify snackbar does NOT appear for PATCH responses without `config_transition` (description-only or times-only edits).

## 4. Verification

- [x] 4.1 Run `npx tsc --noEmit` and confirm zero type errors.
- [x] 4.2 Manually test W→M: select Monthly — hint appears. Save — dialog closes, snackbar shows correct month. For a change on the 1st of a month, verify extended copy appears.
- [x] 4.3 Manually test M→W: select Weekly — hint appears. Save — snackbar shows correct Monday date.
- [x] 4.4 Manually test reverting dropdown: hint disappears when original value is re-selected.
- [x] 4.5 Manually test description-only edit: no snackbar appears.
