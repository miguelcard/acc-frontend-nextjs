## Why

Space members have no visibility into each other's progression — level, XP, and streaks are hidden on the private profile page. Surfacing this data publicly within a space context adds a motivational, social accountability layer that is core to the app's purpose.

## What Changes

- Add a new backend endpoint that exposes a curated public XP/stats payload for any user by ID.
- Extend `MemberT` (or add a new `MemberPublicStatsT`) so the frontend can fetch a member's public stats.
- Make member avatars and usernames in `MembersList` tappable — clicking opens a `DialogModal` showing the member's full XP card (level, total XP, progress bar, longest streak, completed periods).
- Reuse and adapt the existing `XPCard` component so the public view renders identically to the owner's own profile card.

## Capabilities

### New Capabilities

- `member-public-xp-profile`: A tappable member entry in the members list that opens a modal displaying the member's level, XP, streak, and completed periods — mirroring the owner's own XP card.

### Modified Capabilities

- `member-completion-leaderboard`: The members list rendering is changing (entries become tappable) which is adjacent to leaderboard-style member display — no spec-level requirement change, implementation detail only.

## Impact

- **Backend**: New endpoint required — `GET /v1/users/:id/public-stats/` returning `{ level, total_xp, xp_into_level, xp_for_level, pct_to_next, longest_streak, longest_streak_unit, completed_periods }`. No heatmap in public view. Level label is derived on the frontend from the integer `level`.
- **Frontend**:
  - `lib/fetch-queries.ts` — new fetch function for public member stats
  - `lib/hooks/queries.ts` — new `useMemberPublicStats(userId)` hook
  - `lib/query-keys.ts` — new cache key `memberPublicStats: (userId) => [...]`
  - `lib/types-and-constants.ts` — new `MemberPublicStatsT` type
  - `components/shared/SpaceMembers/` — `MembersList` rows become tappable, opening a `DialogModal` with the public XP card
  - `components/profile/XPCard/` — extract or adapt to accept external stats data (props) rather than always calling `useXPStats()` internally, so it can render another user's stats
- **No new dependencies** — `DialogModal` and the XP display patterns are already established.
