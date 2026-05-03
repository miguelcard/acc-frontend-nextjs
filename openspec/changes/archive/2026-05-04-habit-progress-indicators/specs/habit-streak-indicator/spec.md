## ADDED Requirements

### Requirement: Streak badge inline with habit title
For each habit row in the ScoreCard, the system SHALL display a streak badge of the form `🔥 Nw` (for weekly habits) or `🔥 Nm` (for monthly habits) where N is the number of consecutive past periods in which the user met their habit goal.

The badge SHALL appear inline immediately after the frequency label (e.g., `"Exercise (3x/week) 🔥 4w"`).

If the current period streak is zero or the streak data is unavailable, NO badge SHALL be shown.

Streak data SHALL be provided by the backend as an optional `streak` field on `HabitT` (e.g., `{ count: number; unit: "W" | "M" }`). If the field is absent, the badge is silently omitted.

Only the habit owner's streak is shown on their own habits. Other members' streaks are also shown on their respective habit rows (all visible, consistent with progress bar visibility).

#### Scenario: Active weekly streak
- **WHEN** a user has met their weekly habit goal for 4 consecutive weeks
- **THEN** the badge `🔥 4w` SHALL appear after the frequency label on that habit row

#### Scenario: Active monthly streak
- **WHEN** a user has met their monthly habit goal for 2 consecutive months
- **THEN** the badge `🔥 2m` SHALL appear after the frequency label on that habit row

#### Scenario: No streak
- **WHEN** a user has not met their habit goal in the most recent completed period
- **THEN** NO streak badge SHALL appear on that habit row

#### Scenario: Streak data unavailable
- **WHEN** the backend does not return a `streak` field for a habit
- **THEN** the habit row SHALL render normally with no badge and no error
