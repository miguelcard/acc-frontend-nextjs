## Context

The "All my Habits" page (`app/(authenticated-pages)/all-habits/page.tsx`) already fetches both `userSpaces` and `allRecurrentHabits`. The `groupHabitsBySpace` utility filters out spaces with zero habits, so the view only ever receives spaces that have at least one habit belonging to the user. When no habits exist at all, the view renders a single generic empty state message with no actionable path.

The `CreateHabitDialogModal` component (used inline in `SpaceModalOptions`) already accepts a `spaceId` and handles habit creation per space — it just isn't surfaced directly in the empty card.

## Goals / Non-Goals

**Goals:**
- Distinguish between "no spaces" and "has spaces but no habits" empty states.
- Show all user spaces on the page, including those with zero user habits.
- Surface a per-space "Add habit" CTA directly in the empty content card for spaces without habits.
- Provide a "Create a space" CTA when the user has no spaces at all.

**Non-Goals:**
- Building a global "create habit + pick space" multi-step form.
- Changing the habit creation form itself (`CreateHabitForm`).
- Modifying the layout or behaviour for spaces that already have habits.

## Decisions

### 1. Extend `groupHabitsBySpace` rather than replace it

The existing function is used only in one place. We'll add an optional `includeEmptySpaces` parameter (defaulting to `false` for backwards safety) that, when `true`, also appends spaces that have no habits for the current user.

**Alternative considered:** A separate utility function (`groupAllSpacesByHabits`). Rejected to avoid duplication — a flag keeps the logic co-located and the signature change is additive.

### 2. Pass `allSpaces` separately from `groupedHabits` to the view

The page already has `spacesPaginated`. We pass it alongside `groupedHabits` using the extended utility with `includeEmptySpaces: true`, replacing the current call.

**Alternative considered:** Passing spaces as a separate prop and merging inside the component. Rejected — keeping the merge in `groupHabitsBySpace` keeps the view prop surface clean.

### 3. Inline "Add habit" CTA inside the empty ContentCard per space

Reuse the existing `WrapInCreateHabitModal` / `CreateHabitDialogModal` already present in the file. Replace the `"No habits in this space"` text node with a small CTA button that opens the modal.

**Alternative considered:** A tooltip or a "+" icon on the space header row. Rejected — less discoverable; the card area is already visible and the empty card is the natural affordance.

### 4. Top-level empty state branches on `spaces.length`

When `groupedHabits.length === 0`:
- If no spaces → show "Create a space first" card with a button routing to `/spaces`.
- If spaces exist → this branch is no longer reachable (all spaces now appear). The per-space empty card handles it.

## Risks / Trade-offs

- **Spaces the user is a member of but doesn't own**: Users can create habits in any space they're a member of, so showing all spaces is correct. No restriction is needed.
- **Many spaces with no habits**: The page could feel long. Mitigation: the existing collapse/expand per-space already handles this — spaces default to expanded, users can collapse.
- **`groupHabitsBySpace` backwards compatibility**: The `includeEmptySpaces` param defaults to `false`, so no other callers (if any) are affected.
