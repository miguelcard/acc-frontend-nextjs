## Why

The left-edge vertical fill bar on each habit card always reflects the **current** week/month, even when the user has navigated to a previous week using the calendar selector. This means users cannot see historical progress: a habit completed in the current week looks full even when viewing a past week where no checkmarks were made.

## What Changes

- The `computeHabitProgress` utility will accept an optional `viewDates` parameter (the visible date range) to scope the progress calculation to the displayed week/month instead of hardcoding "now".
- The `SmallScreenHabitScoreCard` component will pass its `dates` prop into `computeHabitProgress` so the bar always reflects the week being viewed.
- The `computeMemberScore` utility will be updated to also accept the date range so member scores remain consistent with the visible period.

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `habit-progress-bar`: The requirement that "current period" is always the live calendar week/month is relaxed. The bar now reflects the **period containing the displayed dates** rather than the period containing today. For weekly habits, the period is the Mon–Sun week that contains the first date in the view; for monthly habits, it is the calendar month that contains the first date in the view.

## Impact

- `lib/utils/compute-habit-progress.ts` — `computeHabitProgress` and `computeMemberScore` signatures change (additive, optional param — no breaking callers).
- `components/space/ScoreCard/score-card-sizes/small-screen-habit-score-card.tsx` — passes `dates` to `computeHabitProgress`.
- Anywhere else that calls `computeHabitProgress` / `computeMemberScore` without a date range will continue to use the current period (backward-compatible default).
