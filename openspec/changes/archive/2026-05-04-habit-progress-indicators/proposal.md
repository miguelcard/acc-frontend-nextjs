## Why

The app's core value proposition is accountability through visibility — but the current ScoreCard only shows raw checkboxes with no sense of progress toward goals, no awareness of how the group is doing collectively, and no incentive to maintain consistent habits over time. Adding progress indicators directly addresses the "variable reward" and "investment" hooks: users need to feel the pull of a filling bar, a building streak, and a team depending on them.

## What Changes

- **Habit progress bar**: A color-coded horizontal progress bar rendered inline next to each habit's title and frequency label, showing completion rate for the current period (week or month depending on `time_frame`). Red < 35%, yellow < 70%, green ≥ 70%.
- **Habit streak indicator**: A compact emoji badge (`🔥 Nw` or `🔥 Nm`) shown inline after the frequency label, representing consecutive periods where the user hit their habit goal. Nothing shown for a broken or zero streak.
- **Member completion leaderboard**: A summary card above the date selector in the space ScoreCard showing each member's overall completion percentage for the current period, with a supportive progress bar per member.
- **Space team score card**: A summary card displayed as the first content element on the space page (above member sections and date selector) showing the group's collective completion rate for the current period.

## Capabilities

### New Capabilities
- `habit-progress-bar`: Per-habit color-coded progress bar inline in the ScoreCard habit row, computed from checkmarks vs. goal for the current `time_frame` period.
- `habit-streak-indicator`: Per-habit consecutive-period streak counter displayed as `🔥 Nw`/`🔥 Nm` inline after the frequency label. Requires historical checkmark data fetched from the backend.
- `member-completion-leaderboard`: Per-member aggregated completion card shown above the date range selector in the space ScoreCard.
- `space-team-score`: Space-level collective completion percentage card shown at the top of the space page content.

### Modified Capabilities

## Impact

- `components/space/ScoreCard/score-card-sizes/small-screen-habit-score-card.tsx` — progress bar + streak badge added to each habit row.
- `components/space/ScoreCard/score-card.tsx` — leaderboard card inserted above `DatesRangeSelector`; team score card inserted above leaderboard.
- `lib/utils/` — new pure utility `compute-habit-progress.ts` for progress %, streak calculation, member aggregation, team score.
- `lib/fetch-queries.ts` + `lib/hooks/queries.ts` — new query for historical checkmarks per habit (needed for streak computation beyond the currently loaded date range).
- Backend: potentially a new endpoint or query param to return per-habit streak data, OR client-side multi-week fetch.
- No changes to `HabitT`, `CheckMarkT` types required — all data already available.
