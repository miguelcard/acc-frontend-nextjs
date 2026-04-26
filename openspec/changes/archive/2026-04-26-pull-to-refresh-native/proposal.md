## Why

Native mobile apps universally support pull-down-to-refresh as a gesture — users expect it. Without it, the app feels like a website in a wrapper rather than a real native app. Adding this improves perceived quality and allows users to manually refresh stale data without navigating away.

## What Changes

- Install `react-simple-pull-to-refresh` as a new dependency
- Wrap the authenticated page layout's content area with a `PullToRefresh` component, guarded so it only activates on native Capacitor platforms
- On pull gesture completion, invalidate the entire React Query cache to trigger refetch of all active queries

## Capabilities

### New Capabilities

- `pull-to-refresh`: Pull-down gesture on native mobile (iOS/Android) that invalidates the React Query cache and triggers a data refresh for the current page

### Modified Capabilities

## Impact

- **New dependency**: `react-simple-pull-to-refresh` (~0 transitive deps)
- **Modified file**: `components/shared/BottomNavigationLayout/bottom-navigation-layout.tsx` — wraps children with the pull-to-refresh component
- **Platforms affected**: iOS and Android Capacitor builds only; web is unaffected (guarded by `Capacitor.isNativePlatform()`)
- **Data layer**: React Query cache invalidation via `queryClient.invalidateQueries()` — all active queries on the current page will re-fetch
