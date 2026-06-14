## Context

XP stats are currently fetched exclusively via `GET /v1/user/xp-stats/` — a self-only endpoint — and rendered by `XPCard`, which calls `useXPStats()` internally. `MembersList` renders a read-only list of avatars + username + name with no interactivity. There is no backend endpoint for viewing another user's XP stats.

The change requires work on both layers: a new backend endpoint to expose a curated public stats payload, and frontend changes to make member rows tappable and feed external stats into the XP card.

## Goals / Non-Goals

**Goals:**
- Any member in a space can be tapped to open a modal displaying their level, XP progress, streak, and completed periods.
- The modal XP card renders identically to the owner's own profile card (same layout, same fields).
- Clean separation: `XPCard` remains usable in both self-profile and public-modal contexts without duplication.

**Non-Goals:**
- Heatmap is not exposed publicly (server-side decision).
- No leaderboard or ranked comparison view (Option C — out of scope for now).
- No "created by" click-through on space cards (Option B — skipped).
- No persistent XP badge in the navigation bar (Option D — skipped).

## Decisions

### D1 — Refactor XPCard to accept optional stats props

**Decision:** Split `XPCard` into a presentational inner component that accepts `stats: XPStatsT | MemberPublicStatsT` as props, and keep the existing default export as a self-fetching wrapper that uses `useXPStats()` internally and passes to the inner component.

**Why:** Zero duplication — the rendering logic lives once. The profile page import (`XPCard`) is unchanged. The member modal uses the inner component directly, fed by a dedicated hook.

**Alternative considered:** Create a separate `MemberXPCard` component — rejected because it duplicates ~150 lines of JSX and means two components to keep in sync.

---

### D2 — New backend endpoint: `GET /v1/users/:id/public-stats/`

**Decision:** A new endpoint returning a curated subset: `{ level, total_xp, xp_into_level, xp_for_level, pct_to_next, longest_streak, longest_streak_unit, completed_periods }`. No heatmap. Authenticated (requires valid Bearer token) but readable by any member. The level label ("Newcomer", "Disciplined", etc.) is derived on the frontend from the `level` integer using the existing `levelLabel()` function in `xp-card.tsx` — it is not included in the API response.

**Why:** XP stats are not on `MemberT` today, and adding them there would bloat every member list response. A dedicated per-user endpoint is on-demand and cacheable per user ID.

**Alternative considered:** Add XP fields directly to `MemberT` (always fetched with the members list) — rejected because it over-fetches data that is only needed when a user explicitly taps a member.

---

### D3 — Tappable rows via wrapper in MembersList, not MembersListEditable

**Decision:** Add tap behaviour only to `MembersList` (the read-only variant used inside `ClickableAvatarsGroup`'s dialog). `MembersListEditable` (admin view) is left unchanged — the ⋮ menu already occupies the row action.

**Why:** `MembersListEditable` rows already have an action affordance. Adding a second tap target would create a confusing UX. The read-only `MembersList` is the natural context for viewing a member's profile.

---

### D4 — Cache key scoped to user ID

**Decision:** `queryKeys.memberPublicStats: (userId: number) => ['user', userId, 'public-stats']`

**Why:** Consistent with the existing `queryKeys.space(id)` pattern. Each member's stats are cached independently so navigating between members in the list doesn't refetch unnecessarily.

## Risks / Trade-offs

- **XPCard refactor surface area** → Keep the refactor minimal: extract an inner `XPCardContent` component that takes a `stats` object; the existing default export is a 3-line wrapper. The profile page import and behaviour are unchanged.
- **Backend not yet available during frontend development** → The new hook can be developed with a loading/error state guard, then wired once the endpoint ships. No blocking dependency on the backend being deployed first.
- **Modal triggers an extra network request** → Acceptable — it is on-demand (tap to open). Stats are cached per user ID by React Query so repeated opens cost nothing.
