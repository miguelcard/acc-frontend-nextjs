## 1. Types

- [x] 1.1 Add `MemberPublicStatsT` type to `lib/types-and-constants.ts` with fields: `level`, `total_xp`, `xp_into_level`, `xp_for_level`, `pct_to_next`, `longest_streak`, `longest_streak_unit`, `completed_periods` (no `level_label` — derived on the frontend from `level` using the existing `levelLabel()` function)

## 2. Data Layer

- [x] 2.1 Add `fetchMemberPublicStats(userId: number)` to `lib/fetch-queries.ts` calling `GET /v1/users/:id/public-stats/` via `authenticatedFetch`
- [x] 2.2 Add `memberPublicStats: (userId: number) => ['user', userId, 'public-stats']` to `lib/query-keys.ts`
- [x] 2.3 Add `useMemberPublicStats(userId: number | null)` hook to `lib/hooks/queries.ts` with `enabled: !!userId && !authLoading && !!firebaseUser`

## 3. XPCard Refactor

- [x] 3.1 Extract inner `XPCardContent` presentational component inside `xp-card.tsx`
- [x] 3.2 Update the existing default export `XPCard` to remain a self-fetching wrapper

## 4. Member Profile Modal

- [x] 4.1 Create `components/shared/SpaceMembers/member-profile-modal.tsx`
- [x] 4.2 Export `MemberProfileModal` from the SpaceMembers barrel/index if one exists, or import directly where needed

## 5. MembersList Tappable Rows

- [x] 5.1 Add local state (`selectedMember: MemberT | null`) to the `MembersList` component
- [x] 5.2 Wrap each member row in `MembersList` with an `onClick` handler that sets `selectedMember`
- [x] 5.3 Render `<MemberProfileModal>` below the list
- [x] 5.4 Add tappable avatar + username in `MembersListEditable` (members page) — avatar and text area open `MemberProfileModal`, ⋮ admin menu untouched

## 6. Verification

- [x] 6.1 Open a space, tap the avatars group to open the members list, tap a member row — confirm the profile modal opens with the correct username/name header
- [x] 6.2 Confirm the XP card renders with level, progress bar, streak, and completed periods
- [x] 6.3 Confirm closing and reopening the same member's modal does not trigger a second network request (check React Query DevTools or network tab)
- [x] 6.4 Confirm the profile page `XPCard` still renders correctly (no regression from the refactor)
- [x] 6.5 Run `npx tsc --noEmit` and confirm zero type errors
