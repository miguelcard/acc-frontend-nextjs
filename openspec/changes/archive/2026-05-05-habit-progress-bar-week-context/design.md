## Context

The `computeHabitProgress` utility currently derives the period boundaries from `new Date()` (i.e. right now). When the user navigates to a previous week via the ScoreCard calendar, the `dates` array passed to `SmallScreenHabitScoreCard` changes to reflect that week, but the progress bar still calls `computeHabitProgress(habit, checkedDates)` with no date context — so it always shows the current week's completions.

The `dates` prop is already plumbed all the way down to the card. The ScoreCard fetches `checkedDates` for the entire displayed range already, so no new data-fetching is required.

## Goals / Non-Goals

**Goals:**
- Progress bar reflects the checkmarks within the period that **contains the displayed dates**, not always today's period.
- Change is backward-compatible: call sites that don't pass a date range continue using the current-period behaviour.
- `computeMemberScore` is also updated for consistency in the leaderboard.

**Non-Goals:**
- Changing how `checkedDates` is fetched or cached.
- Supporting arbitrary date ranges that don't correspond to a full week/month period.
- Updating the `progressColor` utility (it's not used for the fill bar).

## Decisions

### Add optional `viewDate` parameter to `computeHabitProgress`

`computeHabitProgress(habit, checkedDates, viewDate?: Date)`

When `viewDate` is provided, `getWeekStart` and `getMonthStart` derive the period from that date instead of `new Date()`. When omitted, behaviour is unchanged.

**Alternative considered:** pass the full `dates: Date[]` array and derive the period from `dates[0]`.  
**Rejected:** The function should remain a pure utility with minimal surface area. A single `Date` anchor is simpler; the caller can pass `dates[0]` or the middle of the week — any date within the target week/month is sufficient.

**Alternative considered:** pass explicit `periodStart`/`periodEnd` dates.  
**Rejected:** Over-engineered. The habit's `time_frame` already encodes the period type; we just need to anchor to the right week/month.

### Pass `dates[0]` as `viewDate` from the score card

`SmallScreenHabitScoreCard` already receives `dates: Date[]`. Passing `dates[0]` (the start of the visible week) into `computeHabitProgress` is the minimal, zero-new-state change.

## Risks / Trade-offs

- **Risk:** `dates` array is empty.  
  → Mitigation: Fall back to `new Date()` when `viewDate` is undefined or `dates` is empty.

- **Trade-off:** Monthly habits will show the progress of the month containing the viewed week. If a user scrolls to a different week in the same month the bar stays the same — this matches the existing spec's intent that monthly habits are scoped to the calendar month.

## Open Questions

_None — the approach is straightforward._
