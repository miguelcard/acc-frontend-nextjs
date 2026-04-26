## Context

The app uses Capacitor 8 to deliver a Next.js 15 static export as a native iOS/Android app. All pages are client-rendered with no SSR. Data fetching is centralised in TanStack React Query v5 — all queries invalidate via `queryClient.invalidateQueries()`. The authenticated app shell is wrapped by `BottomNavigationLayout`, which is the single layout component that surrounds all authenticated page content.

Currently there is no pull-to-refresh mechanism. Users must navigate away and back, or wait for React Query's background refetch interval, to see updated data.

## Goals / Non-Goals

**Goals:**
- Add pull-down-to-refresh gesture on native Capacitor builds (iOS + Android)
- On successful pull, invalidate the full React Query cache to refetch all active queries on the current page
- Keep the web experience completely unchanged
- Use `react-simple-pull-to-refresh` as the gesture/UI library (zero transitive deps, built-in TypeScript types, handles iOS overscroll quirks)

**Non-Goals:**
- Page-aware or query-specific cache invalidation (overkill for this app size)
- Custom pull animation or theming
- Web / desktop pull-to-refresh support
- Cordova or non-Capacitor environments

## Decisions

### Decision 1: `react-simple-pull-to-refresh` over a custom touch handler

**Chosen**: `react-simple-pull-to-refresh`

**Alternatives considered**:
- *Custom `touchstart`/`touchmove`/`touchend` handler* — requires manual scroll-top detection, iOS rubber-band edge case handling, and animation implementation. High maintenance surface for solved problem.
- *Capacitor community plugin* — does not exist for Capacitor 8; the `@capacitor-community/pull-to-refresh` repo returns 404.

**Rationale**: The library has zero dependencies, ships TypeScript types, and already handles the scroll-top detection and iOS overscroll fix (v1.2.4). Its `onRefresh` prop expects `() => Promise<void>`, which maps directly to `queryClient.invalidateQueries()`.

### Decision 2: Invalidate ALL queries via `queryClient.invalidateQueries()`

**Chosen**: Invalidate all with no filter

**Alternatives considered**:
- *Page-aware invalidation* (map `pathname` → specific query keys) — more precise, but adds routing logic that must be kept in sync as routes evolve. Unnecessary complexity given React Query only re-fetches queries that have active observers.

**Rationale**: `invalidateQueries()` with no arguments flags all cache entries stale, but React Query only issues network requests for queries that are currently mounted and observed. Unobserved queries are lazily re-fetched on next mount. This gives "refresh current page" semantics automatically with zero per-route wiring.

### Decision 3: Placement in `BottomNavigationLayout`

**Chosen**: Wrap `{children}` inside `BottomNavigationLayout`

**Rationale**: This is the single layout component that wraps all authenticated page content. Placing the wrapper here means every authenticated page gets pull-to-refresh automatically with no per-page code. The outer `Box` with `pb`/`pt` safe area insets remains unchanged — `PullToRefresh` wraps only the children.

### Decision 4: Native guard via `Capacitor.isNativePlatform()`

The `PullToRefresh` component renders only when `Capacitor.isNativePlatform()` returns `true`. On web, the children are rendered directly without any wrapper. This ensures zero behaviour change for web users.

## Risks / Trade-offs

- **React 19 peer dep mismatch** → The library declares `react@18` as a peer dep. React 19 is backwards compatible; no runtime issues expected. Risk: theoretically unsupported. Mitigation: the library has zero internal React version dependencies — it uses only standard hooks and touch events.
- **Spinner style may not match app theme** → Default spinner uses a generic CSS animation. Mitigation: acceptable for first implementation; can be replaced via `refreshingContent` prop later.
- **Pull gesture conflicts with vertical scroll** → The library only activates when `scrollTop === 0`. If a page has a scrollable container that is not the window, the gesture may not work as expected. Mitigation: most pages in this app are not deeply nested scrollable surfaces; acceptable known limitation for initial implementation.

## Migration Plan

1. Install `react-simple-pull-to-refresh`
2. Modify `BottomNavigationLayout` — conditional render with `PullToRefresh` wrapper on native
3. Build and test on Android emulator (`npm run cap:android-emulator`) and iOS simulator (`npm run cap:ios`)
4. No rollback complexity — removing the component restores prior behaviour exactly

## Open Questions

- None — design is fully determined by prior exploration.
