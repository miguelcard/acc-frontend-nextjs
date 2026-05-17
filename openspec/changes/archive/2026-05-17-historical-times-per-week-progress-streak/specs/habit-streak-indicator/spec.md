## MODIFIED Requirements

### Requirement: Streak badge inline with habit title
For each habit row in the ScoreCard, the system SHALL display a streak badge of the form `🔥 Nw` (for weekly habits) or `🔥 Nm` (for monthly habits) where N is the number of consecutive past periods in which the user met their habit goal **as measured against the target that was in effect during each respective period**.

A period SHALL only count toward the streak if the number of `DONE` checkmarks in that period was greater than or equal to the `times` value recorded in `RecurrentHabitConfigHistory` for that period (i.e., the target active at the period's start date). A subsequent change to `times` MUST NOT retroactively make previously-incomplete periods count toward the streak, nor MUST it invalidate previously-complete periods.

The badge SHALL appear inline immediately after the frequency label (e.g., `"Exercise (3x/week) 🔥 4w"`).
If the current period streak is zero or the streak data is unavailable, NO badge SHALL be shown.
Streak data SHALL be provided by the backend as an optional `streak` field on `HabitT` (e.g., `{ count: number; unit: "W" | "M" }`). If the field is absent, the badge is silently omitted.
Only the habit owner's streak is shown on their own habits. Other members' streaks are also shown on their respective habit rows (all visible, consistent with progress bar visibility).

#### Scenario: Active weekly streak with unchanged target
- **WHEN** a user has met their weekly habit goal for 4 consecutive weeks and has never changed the target
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

#### Scenario: Increasing target does not inflate past streak
- **WHEN** a habit had `times=3` for the past 2 weeks, the user completed it only 1×/week each week, and the user then changes `times` to `1`
- **THEN** the streak badge SHALL remain absent (those past weeks did not meet the goal of 3 that was in effect at the time)

#### Scenario: Decreasing target does not retroactively invalidate past streak
- **WHEN** a habit had `times=1` for the past 3 weeks, the user completed it 1×/week each week (meeting the goal), and the user then changes `times` to `3`
- **THEN** the streak badge SHALL still show `🔥 3w` (those past weeks did meet the goal of 1 that was in effect at the time)
