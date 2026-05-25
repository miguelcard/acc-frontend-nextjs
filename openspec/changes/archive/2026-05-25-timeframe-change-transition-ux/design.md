## Context

The `EditHabit` component (`components/space/ScoreCard/score-card-sizes/HabitOptionsMenu/edit-habit.tsx`) presents a Formik-driven stepper form. One step contains a `time_frame` dropdown and a `times` number field. On submit, it calls `usePatchHabit(...).mutateAsync()` which returns the full updated `HabitT` from the API.

After the companion backend change, the PATCH response will include a `config_transition` object when `time_frame` changed. The frontend needs to surface two pieces of feedback:
1. **Before save**: an inline hint under the dropdown while the user is deciding
2. **After save**: a snackbar confirming the change and showing the exact date the new rule kicks in

A `CustomSnackbar` component already exists at `components/shared/Snackbar/snackbar.tsx` and is used elsewhere (e.g. invite members flow). The inline hint will use MUI's `Alert` component.

## Goals / Non-Goals

**Goals:**
- Inline `Alert` appears in the form when `values.time_frame !== habit.time_frame`, with copy tailored to direction (W→M vs M→W) and today's date.
- Post-save `CustomSnackbar` appears after successful mutation, with exact date from `config_transition.new_effective_from`.
- Edge case copy for W→M on the first day of a month (transition deferred a full extra month — add a brief explanation).
- `HabitT` extended with optional `config_transition` field.
- No extra API calls — all data comes from the existing PATCH response.

**Non-Goals:**
- Confirmation/blocking dialogs — the feedback is informational only, never blocking.
- Changing the form layout or stepper structure.
- Any changes to the progress bar, streak badge, or score card.
- Handling `times`-only changes (no time_frame change) — no feedback needed for that.

## Decisions

### 1. Inline hint computed client-side, snackbar uses API date

The inline hint (pre-save) is computed purely from `values.time_frame`, `habit.time_frame`, and `new Date()`. No API call needed — the logic is a simple date calculation matching what the backend will do.

The snackbar (post-save) uses `config_transition.new_effective_from` from the API response — the authoritative date, no client-side date logic needed.

**Why split?** The inline hint needs to be reactive immediately (Formik field change). The snackbar is shown only once after a successful save, so using the server's authoritative date is both simpler and more correct.

### 2. Inline hint copy

| Direction | Copy |
|---|---|
| W→M (normal) | `ℹ Weekly tracking continues until end of [Month]. Monthly XP starts [Month+1] 1.` |
| W→M (on 1st of month) | `ℹ Weekly tracking continues through all of [Month]. Monthly XP starts [Month+1] 1. (Your current weekly streak is preserved through [Month].)` |
| M→W | `ℹ Monthly tracking continues through this week. Weekly XP starts next week.` |

### 3. Snackbar copy (uses API date)

| Direction | Copy |
|---|---|
| W→M | `Habit updated. Weekly tracking runs through end of [Month]. Monthly tracking begins [new_effective_from formatted as "Month D"].` |
| M→W | `Habit updated. Monthly tracking ends Sunday [new_effective_from − 1 day, e.g. "May 31"]. Weekly tracking begins Monday [new_effective_from formatted as "Month D", e.g. "June 1"].` |

### 4. `config_transition` on `HabitT`

Add an optional field to `HabitT`:
```ts
config_transition?: {
  old_time_frame: 'W' | 'M';
  new_time_frame: 'W' | 'M';
  new_effective_from: string; // ISO date
};
```

This is only populated on the mutation response (PATCH result), never in the regular habit list/fetch. The component reads it from `updatedHabit.config_transition` after `mutateAsync` resolves.

### 5. Toast rendered at document root via `react-hot-toast`

`EditHabit` uses `react-hot-toast` (already a project dependency, used in `HabitOptionsMenu` for delete). After `mutateAsync` resolves with a `config_transition`, `toast(message, { duration: 6000 })` is called and then `handleCloseDialog?.()` immediately — the dialog closes at once while the toast persists independently at the document root. No local `snackbarMessage` state needed in `EditHabit`.

## Risks / Trade-offs

- [Inline hint date calculation drifts from backend if logic diverges] → Low risk. The M→W hint is static ("this week / next week") so there is no client-side date arithmetic to drift. The W→M hint formula (1st of next month) is simple and unlikely to change.
- [Toast style differs from CustomSnackbar] → Acceptable. `react-hot-toast` style is consistent with the delete-habit toast already shown in the same options menu. Both use the same `<Toaster>` instance mounted at app root.
