## NOT IMPLEMENTED — Deferred

The space team score card was designed and initially implemented but subsequently **removed** from the final UI. It is deferred to a future change.

### Reason for removal
After implementing `MemberLeaderboard` with per-member completion rings and the per-habit left-edge fill bar, the team score card was judged redundant — it added vertical space without providing meaningful signal beyond what the leaderboard already communicated at a glance.

### Original requirement (for reference)
The ScoreCard was to display a team score card as the first content element above the member leaderboard and date selector, showing the collective completion rate of all habits in the space for the current period.

The card was to show:
- A label (e.g., "Team score")
- A single aggregate percentage
- A color-coded progress bar (red/yellow/green thresholds)
- The count of members contributing

The computation utility `computeTeamScore(allHabits, checkedDates)` still exists in `lib/utils/compute-habit-progress.ts` and can be reused if this is revisited.
