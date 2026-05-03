## 1. Shared Computation Utility

- [x] 1.1 Create `lib/utils/compute-habit-progress.ts` with a `computeHabitProgress(habit, checkedDates)` function that returns a 0–1 ratio of checkmarks vs. goal for the habit's current period (current calendar week for `time_frame: "W"`, current calendar month for `time_frame: "M"`).
- [x] 1.2 Add `computeMemberScore(habits, checkedDates): number` to the same file — averages `computeHabitProgress` across a member's habits (capped at 1.0 per habit).
- [x] 1.3 Add `computeTeamScore(allHabits, checkedDates): number` to the same file — averages `computeHabitProgress` across all space habits.
- [x] 1.4 Add a `progressColor(ratio: number): string` helper returning `'error'` (red) for < 0.35, `'warning'` (yellow) for < 0.70, `'success'` (green) otherwise — matching MUI color tokens.

## 2. Habit Progress Indicator

- [x] 2.1 In `small-screen-habit-score-card.tsx`, import the `computeHabitProgress` + `habitProgressGreen` utilities.
- [x] 2.2 Add a progress indicator per habit. **Shipped as a vertical 4px left-edge fill bar** (not a horizontal LinearProgress): absolutely-positioned inside the habit card row (`position: relative`, `overflow: hidden`), filling bottom-to-top using `habitProgressGreen(ratio)` (continuous green scale, no red/yellow). Animates `height` and `background-color` on toggle.
- [x] 2.3 Cap the displayed value at 100% (`Math.min(ratio * 100, 100)`).

## 3. Streak Badge

- [x] 3.1 Add an optional `streak?: { count: number; unit: 'W' | 'M' }` field to `HabitT` in `lib/types-and-constants.ts`.
- [x] 3.2 In `small-screen-habit-score-card.tsx`, render a streak badge `🔥 Nw` or `🔥 Nm` inline after the frequency label `(Nx/week)`, only when `habit.streak && habit.streak.count > 0`.
- [x] 3.3 Coordinate with backend to return the `streak` field on habits in the space habits endpoint. (Backend task — frontend renders defensively if field is absent.)

## 4. Member Completion Leaderboard

- [x] 4.1 Create `components/space/ScoreCard/MemberLeaderboard/member-leaderboard.tsx`. **Shipped with SVG completion ring** (28px, 3px stroke) instead of LinearProgress + percentage label. Ring: green shades when partial, gold (`#FFD700`) at 100%. On completion, triggers random `pop` or `bounce` animation with gold glow.
- [x] 4.2 Style the current user's row distinctly: bold username with `secondary` color accent.
- [x] 4.3 Collapse toggle present. **Card is expanded by default** (not collapsed as originally planned).
- [x] 4.4 In `score-card.tsx`, import and render `<MemberLeaderboard>` above `<DatesRangeSelector>`, wrapped in `<Box mt={2}>`.

## 5. Space Team Score Card

- [x] 5.1 Created `components/space/ScoreCard/SpaceTeamScore/space-team-score.tsx`. **Subsequently removed** from the UI — judged redundant once the leaderboard rings provided sufficient at-a-glance completion signal. Component file was deleted.
- [x] 5.2 `<SpaceTeamScore>` was briefly wired into `score-card.tsx` then removed. `MemberLeaderboard` is the only element above `<DatesRangeSelector>`.

## 6. Verify

- [x] 6.1 Verify progress bar colors update correctly as checkboxes are toggled (real-time recompute).
- [x] 6.2 Verify monthly habits use current calendar month window, not current week window.
- [x] 6.3 Verify leaderboard sorts correctly and current user row is highlighted.
- [x] 6.4 Verify team score card is hidden when a space has no habits.
- [x] 6.5 Verify streak badge renders only when `habit.streak.count > 0` and is absent when field is missing.
- [x] 6.6 Run `npx tsc --noEmit` and confirm no type errors.
