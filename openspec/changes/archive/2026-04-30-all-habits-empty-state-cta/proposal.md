## Why

The "All my Habits" page shows a generic "You haven't created any habits yet" message when no habits exist, providing no actionable path forward. Users with existing spaces but no habits are left stranded, and spaces without habits are silently hidden from the view, creating a confusing experience.

## What Changes

- The `groupHabitsBySpace` utility is extended to optionally include spaces that have zero habits.
- The "All my Habits" page passes all user spaces (not just those with habits) to the view.
- The `AllUserHabitsView` component renders two distinct empty states:
  - **No spaces exist**: Show a CTA directing the user to create a space first.
  - **Spaces exist but no habits in some/all**: Show all spaces, with an inline "Add habit" button surfaced directly in the empty card for each space without habits (instead of the generic text).

## Capabilities

### New Capabilities

- `all-habits-empty-state`: Contextual empty states and progressive CTAs on the all-habits page based on user's space membership and habit status.

### Modified Capabilities

<!-- No existing specs are changing at the requirement level. -->

## Impact

- `lib/utils/group-habits-by-space.ts` — extend to support including spaces with zero habits
- `app/(authenticated-pages)/all-habits/page.tsx` — pass all spaces to the view component
- `components/all-habits/AllUserHabits/all-user-habits.tsx` — update empty state rendering logic; surface inline habit creation CTA per space
