## 1. Extend groupHabitsBySpace Utility

- [x] 1.1 Add optional `includeEmptySpaces: boolean` parameter (default `false`) to `groupHabitsBySpace` in `lib/utils/group-habits-by-space.ts`
- [x] 1.2 When `includeEmptySpaces` is `true`, append spaces that have no habits (not already in the map) as entries with an empty `habits` array

## 2. Update Page to Pass All Spaces

- [x] 2.1 In `app/(authenticated-pages)/all-habits/page.tsx`, call `groupHabitsBySpace` with `includeEmptySpaces: true` so all user spaces appear in `groupedHabits`
- [x] 2.2 Derive a separate `hasSpaces` boolean from `spacesPaginated.results.length > 0` to drive the top-level empty state branching

## 3. Update AllUserHabitsView Empty States

- [x] 3.1 In `components/all-habits/AllUserHabits/all-user-habits.tsx`, accept `hasSpaces` as a new prop on `UserAllHabitsViewPropsT`
- [x] 3.2 Replace the existing `userHabitsGroupedBySpace.length === 0` empty state with two branches:
  - If `!hasSpaces`: render a card with "You don't have any spaces yet" message and a "Create a Space" button that navigates to `/spaces`
  - If `hasSpaces` and length is 0: this state is now unreachable (all spaces shown), but keep a fallback for safety
- [x] 3.3 In the per-space `ContentCard`, replace the `"No habits in this space"` text with a `WrapInCreateHabitModal` button ("+ Add your first habit") when `habits.length === 0`

## 4. Wire Up Page Props

- [x] 4.1 Pass `hasSpaces` from `page.tsx` down to `<AllUserHabitsView />`
- [x] 4.2 Verify the page renders correctly for all three scenarios: no spaces, spaces with no habits, spaces with habits
