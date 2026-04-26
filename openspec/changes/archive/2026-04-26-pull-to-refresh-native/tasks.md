## 1. Install Dependency

- [x] 1.1 Install `react-simple-pull-to-refresh` via npm

## 2. Implement Pull-to-Refresh Wrapper

- [x] 2.1 Import `PullToRefresh` from `react-simple-pull-to-refresh` and `useQueryClient` from `@tanstack/react-query` in `BottomNavigationLayout`
- [x] 2.2 Add `isNative` guard using `Capacitor.isNativePlatform()` (import `Capacitor` from `@capacitor/core`)
- [x] 2.3 Implement `handleRefresh` async function that calls `queryClient.invalidateQueries()` and returns a Promise
- [x] 2.4 Conditionally wrap `{children}` with `<PullToRefresh onRefresh={handleRefresh}>` when `isNative` is true, otherwise render children directly

## 3. Verify

- [x] 3.1 Run `npx tsc --noEmit` to confirm no TypeScript errors
- [x] 3.2 Build and test pull gesture on Android emulator (`npm run cap:android-emulator`) — confirm spinner appears, data refreshes, and web build is unaffected
