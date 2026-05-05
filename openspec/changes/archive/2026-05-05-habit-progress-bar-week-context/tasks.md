## 1. Update `computeHabitProgress` utility

- [x] 1.1 Add optional `viewDate?: Date` parameter to `computeHabitProgress` in `lib/utils/compute-habit-progress.ts`
- [x] 1.2 Update `getWeekStart` and `getMonthStart` helper calls inside `computeHabitProgress` to accept a `Date` anchor instead of always using `new Date()`; fall back to `new Date()` when `viewDate` is undefined
- [x] 1.3 Update `computeMemberScore` to accept and forward an optional `viewDate?: Date` parameter to each `computeHabitProgress` call

## 2. Wire date context into the ScoreCard component

- [x] 2.1 In `SmallScreenHabitScoreCard`, pass `dates[0]` (or `undefined` when `dates` is empty) as `viewDate` to `computeHabitProgress` for the fill bar calculation
- [x] 2.2 Verify `computeMemberScore` calls (in `MemberLeaderboard`) also receive the correct `viewDate` if `dates` is available there; skip if no date context exists at that call site

## 3. Verification

- [x] 3.1 Manually test: current week — fill bar shows correct completion ratio
- [x] 3.2 Manually test: navigate to a previous week with fewer checkmarks — fill bar reflects that week's data
- [x] 3.3 Manually test: monthly habit viewed across different weeks in the same month — bar stays constant (correct)
- [x] 3.4 Run `npx tsc --noEmit` and confirm zero type errors
