## Context

The frontend computes the progress bar fill ratio in `computeHabitProgress` (lib/utils/compute-habit-progress.ts) by dividing the checkmark count in the viewed period by `habit.times` — the habit's *current* target. When the user navigates to a past week where the habit had a different target, the denominator is wrong. The backend already stores every target change in `RecurrentHabitConfigHistory` and returns it per habit; this change makes the frontend consume that data.

The streak badge is sourced entirely from the backend `streak` field on `HabitT` and is rendered as-is — no frontend streak logic exists to fix here. The companion backend change fixes `_compute_streak()` to use historical targets; the frontend is unaffected.

## Goals / Non-Goals

**Goals:**
- `computeHabitProgress` uses the historically-correct `times` value for the viewed period, not the current live value.
- `computeMemberScore` inherits the fix transitively (it delegates to `computeHabitProgress`).
- `HabitT` is extended with `config_history` so the helper has the data it needs.
- No extra network requests — history is already included in the habit API response (backend change).

**Non-Goals:**
- Fixing the streak badge (handled entirely by the backend).
- Any UI changes to the progress bar component itself.
- Changing how `checkedDates` or checkmark data is fetched.

## Decisions

### Decision 1: Resolve historical `times` client-side from `config_history`

**Chosen:** Add a private helper `_timesForDate(habit, date)` that binary-searches `config_history` (sorted ascending by `effective_from`) and returns the `times` from the latest entry whose `effective_from ≤ date`. Falls back to `habit.times` if `config_history` is absent or empty.

**Alternative considered:** Ask the backend to pre-compute and return a ratio. Rejected — would require a new API call each time the user navigates to a different week, adding latency. The `config_history` array is tiny (typically 1–5 entries per habit) and already arrives in the initial response.

**Alternative considered:** Compute progress server-side. Rejected — the frontend owns period-scoping logic (Mon–Sun week, calendar month) and already has all the checkmark data in `checkedDates`. Splitting this computation would add complexity without benefit.

### Decision 2: `config_history` sorted ascending, iterate from the end

`config_history` arrives sorted ascending by `effective_from`. To find the entry in effect at `viewDate`, we iterate from the last entry backwards and return the first one where `effective_from ≤ viewDate`. This is O(n) but n is negligible (usually ≤ 5).

### Decision 3: Fallback to `habit.times` when `config_history` is absent

For habits created before `RecurrentHabitConfigHistory` was introduced or where the field is missing from the response, fall back to `habit.times`. This preserves current behaviour (no regression) and the app is not in production yet so data coverage is not a concern.

## Risks / Trade-offs

- [Risk] `config_history` not yet returned by backend → Mitigation: the field is optional on `HabitT`; the helper gracefully falls back to `habit.times`, so the frontend degrades cleanly until the backend change is deployed.
- [Risk] Frontend and backend deployed separately → Mitigation: backward-compatible by design; each side works correctly without the other being deployed first.
- [Trade-off] `config_history` slightly increases the habit object size → Negligible in practice (3 small fields × ≤ 5 entries per habit).
