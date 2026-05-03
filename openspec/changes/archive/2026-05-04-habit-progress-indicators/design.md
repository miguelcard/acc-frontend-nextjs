## Context

The space ScoreCard currently shows per-member habit grids with checkboxes for each day of the selected date range. Habits have `times` (goal) and `time_frame` (`W` = weekly, `M` = monthly) but no visual indication of progress toward that goal. `CheckedDatesT` holds all checkmarks keyed by date string, available in memory at render time. The `useHabitScorecard` hook manages this state and is already shared between `ScoreCard` and `AllUserHabitsView`.

Streak computation requires knowing whether the user hit their goal in **previous** periods (weeks/months), which is beyond what the current date-range window loads. This is the one piece that cannot be fully client-computed from existing data.

## Goals / Non-Goals

**Goals:**
- Progress indicator per habit: computed entirely client-side from `checkedDates` already in memory.
- Member leaderboard: computed client-side from existing `checkedDates`.
- Streak indicator: computed from a new lightweight backend endpoint that returns per-habit streak counts (avoids fetching full checkmark history client-side).
- All new UI components are pure/presentational — no new global state.
- All computation logic lives in a new `lib/utils/compute-habit-progress.ts` utility (pure functions, no React deps).

**Non-Goals:**
- Notifications or push alerts for streak breaks.
- All-time or custom date range leaderboards (current period only).
- Changing the backend data model for `HabitT` or `CheckMarkT`.
- Modifying the `AllUserHabitsView` (only ScoreCard scope for now).

## Decisions

### 1. Progress computation: client-side only
All progress bars and scores are computed from `checkedDates` already in the `useHabitScorecard` hook state. No new API calls needed for this.

**How to count "this period":** For a `time_frame: "W"` habit, count unique dates in `checkedDates` for that habit that fall within the current Monday–Sunday. For `time_frame: "M"`, count dates within the current calendar month. Compare against `times` goal.

**Alternatives considered:** Fetch a fresh aggregated count from the backend. Rejected — adds latency and the data is already available client-side.

### 2. Streak computation: dedicated backend endpoint
The streak requires knowing `N` consecutive prior periods. Fetching N×7 days of checkmarks client-side is expensive and wasteful. Instead, the backend computes the streak and returns it as part of the habit data (or a separate lightweight endpoint).

**Proposed approach:** Add an optional `streak` field to `HabitT` returned by the space habits API (e.g., `streak: { count: 4, unit: "W" }`), computed server-side. If the backend change is not immediately available, streak display is skipped gracefully (field absent = no badge shown).

**Alternatives considered:** Client-side fetch of past 12 weeks of checkmarks. Rejected — too many requests, too much data for a small badge.

### 3. Placement of new UI elements

```
ScoreCard layout (final shipped):
├── [NEW] MemberLeaderboard ("Weekly Scorecard" card, expanded by default)
├── DatesRangeSelector            ← existing (unchanged)
└── [per member]
    ├── Member header row         ← existing
    └── ContentCard
        └── [per habit row]       ← position: relative, overflow: hidden
            ├── [NEW] Left-edge fill bar (4px, absolute, bottom→top)
            ├── Title + frequency + [NEW] 🔥 Nw  ← streak badge
            └── Checkboxes row   ← existing
```

Note: `SpaceTeamScore` card was initially placed above `MemberLeaderboard` but was **removed** — judged redundant once the leaderboard rings provided sufficient at-a-glance completion signal.

### 4. Progress indicator: vertical left-edge fill bar (shipped) vs horizontal bar (original plan)

**Original plan:** MUI `LinearProgress` with red/yellow/green color thresholds placed between the title row and checkboxes.

**Shipped:** A 4px absolutely-positioned vertical fill bar anchored to the left edge of the habit card, filling from bottom to top, using a single continuous green scale (`habitProgressGreen(ratio)` — transparent→solid `#2dc38c`). No red or yellow.

**Why changed:** After user testing, the horizontal bar added a visual row that felt cluttered between the title and checkboxes. The left-edge fill bar conveys the same information without occupying a layout row, enables quick scanning down the left margin, and the bottom-to-top fill direction feels more natural (like filling a container). The all-green scale avoids negative/warning connotations — the goal is motivation, not scoring.

### 5. Leaderboard: SVG completion ring (shipped) vs linear bar (original plan)

**Original plan:** Per-member linear progress bar with percentage label and red/yellow/green coloring, collapsed by default.

**Shipped:** A 28px SVG stroke-dasharray ring per member. Ring color: green shades when partial, gold (`#FFD700`) at 100%. No percentage label. Expanded by default. On completion, plays a randomly selected `pop` (scale bounce) or `bounce` (physics ball with squash) animation + gold glow.

**Why changed:** The circular ring is more compact than a bar + label, reads as a familiar "loading/progress" metaphor on mobile, and the gold completion state creates a more rewarding moment than just hitting 100% on a bar. The decision to expand by default improves discoverability — users in an early-stage app need to be shown features, not have them hidden.

### 6. New utility: `lib/utils/compute-habit-progress.ts`
Pure functions (all shipped):
- `computeHabitProgress(habit, checkedDates): number` — 0–1 ratio for current period
- `computeMemberScore(habits, checkedDates): number` — average across member's habits
- `computeTeamScore(allHabits, checkedDates): number` — average across all space habits (utility exists, unused by UI — kept for future use)
- `progressColor(ratio): 'error'|'warning'|'success'` — threshold-based MUI color token (utility exists, unused by UI — kept for future use)
- `habitProgressGreen(ratio): string` — continuous green rgba value used by both the left-edge bar and the leaderboard ring

## Risks / Trade-offs

- [Streak backend change needed] → Design is additive: `streak` field is optional on `HabitT`. Frontend renders badge only if field is present. Can ship progress indicators + leaderboard with zero backend changes, then add streaks in a follow-up.
- [Monthly habit progress in a weekly view] → If the date range selector shows a week but a habit is monthly, we always count checkmarks in the current calendar month regardless of the selected date range, so progress is always meaningful relative to the habit's own time frame.
- [checkedDates only covers loaded range] → If user hasn't loaded the full current week/month yet, the fill bar reflects only what's loaded. Acceptable — the current week is always loaded on mount.
