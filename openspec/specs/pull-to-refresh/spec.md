### Requirement: Pull-to-refresh gesture on native platforms
The app SHALL provide a pull-down gesture on all authenticated pages when running on a native Capacitor platform (iOS or Android) that triggers a full React Query cache invalidation and refetch of all active queries.

#### Scenario: User pulls down on native platform
- **WHEN** the user pulls down from the top of any authenticated page on a native Capacitor build
- **THEN** a loading indicator SHALL appear and all active React Query queries SHALL be invalidated and refetched

#### Scenario: Pull-to-refresh is absent on web
- **WHEN** the app is running in a web browser (non-native)
- **THEN** no pull-to-refresh gesture or UI SHALL be present and page behaviour SHALL be unchanged

#### Scenario: Pull gesture does not trigger mid-scroll
- **WHEN** the user scrolls down a page and then scrolls back up with a pull motion
- **THEN** the pull-to-refresh gesture SHALL only activate when the scroll position is already at the top of the page (scrollTop = 0)

#### Scenario: Refresh completes and indicator disappears
- **WHEN** the pull gesture threshold is crossed and released
- **THEN** the loading indicator SHALL remain visible until all invalidated queries have completed refetching, after which it SHALL disappear
