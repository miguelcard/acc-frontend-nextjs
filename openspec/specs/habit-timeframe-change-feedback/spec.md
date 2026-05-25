# habit-timeframe-change-feedback Specification

## Purpose
TBD - created by archiving change timeframe-change-transition-ux. Update Purpose after archive.
## Requirements
### Requirement: Inline hint shown when time_frame selection changes in Edit Habit form
When the user selects a `time_frame` value in the Edit Habit form that differs from the habit's current `time_frame`, the system SHALL display an informational `Alert` below the time_frame dropdown immediately (without requiring save).

The alert SHALL disappear if the user reverts the selection back to the original value.

The alert text SHALL be directionally appropriate:
- **W→M**: "Weekly tracking continues until end of [current month name]. Monthly XP starts [next month name] 1."
- **W→M on the 1st of the month**: "Weekly tracking continues through all of [current month name]. Monthly XP starts [next month name] 1. Your current weekly streak is preserved through [current month name]."
- **M→W**: "Monthly tracking continues through this week. Weekly XP starts next week."

The alert SHALL use an `info` severity (blue/neutral tone) and SHALL NOT block the user from saving.

#### Scenario: W→M selection shows inline hint
- **WHEN** a user with a weekly habit opens the Edit Habit form and selects "Monthly" in the time_frame dropdown
- **THEN** an info alert SHALL appear below the dropdown with copy indicating weekly tracking continues through end of current month and monthly XP starts the 1st of next month

#### Scenario: M→W selection shows inline hint
- **WHEN** a user with a monthly habit opens the Edit Habit form and selects "Weekly" in the time_frame dropdown
- **THEN** an info alert SHALL appear below the dropdown with copy indicating monthly tracking ends at month close and weekly XP starts next week

#### Scenario: Reverting selection removes inline hint
- **WHEN** a user changes the time_frame dropdown and then changes it back to the original value
- **THEN** the info alert SHALL disappear

#### Scenario: No hint shown when time_frame is unchanged
- **WHEN** a user opens the Edit Habit form and does not change the time_frame field
- **THEN** no hint alert SHALL be shown

#### Scenario: W→M on first day of month shows extended copy
- **WHEN** a user with a weekly habit opens the Edit Habit form on the 1st of a month and selects "Monthly"
- **THEN** the alert SHALL include additional copy noting that weekly tracking covers the entire current month and the streak is preserved

### Requirement: Post-save snackbar shown after successful time_frame PATCH
After a successful PATCH that changes a habit's `time_frame`, the system SHALL display a `CustomSnackbar` confirmation message using the exact transition date returned in the API response `config_transition.new_effective_from`.

The snackbar SHALL appear after the edit dialog closes (dialog closes immediately on save; toast renders at document root via `react-hot-toast` and persists independently).
The snackbar SHALL auto-dismiss after ~5 seconds.
The snackbar message SHALL be directionally appropriate:
- **W→M**: "Habit updated. Weekly tracking runs through end of [Month]. Monthly tracking begins [formatted new_effective_from]."
- **M→W**: "Habit updated. Monthly tracking ends Sunday [new_effective_from − 1 day, formatted as \"Month D\"]. Weekly tracking begins Monday [formatted new_effective_from]."

If the PATCH does not include a `config_transition` field (i.e. `time_frame` did not change), NO snackbar SHALL be shown for transition messaging (existing success/error handling is unaffected).

#### Scenario: W→M PATCH shows snackbar with correct date
- **WHEN** a user saves an Edit Habit form that changes time_frame from W to M
- **THEN** after the dialog closes, a snackbar SHALL appear with a message referencing the exact date from `config_transition.new_effective_from`

#### Scenario: M→W PATCH shows snackbar with correct date
- **WHEN** a user saves an Edit Habit form that changes time_frame from M to W
- **THEN** after the dialog closes, a snackbar SHALL appear with a message referencing the exact date from `config_transition.new_effective_from`

#### Scenario: No snackbar for times-only change
- **WHEN** a user saves an Edit Habit form that changes only `times` (not `time_frame`)
- **THEN** no transition snackbar SHALL appear

#### Scenario: No snackbar for description/title change
- **WHEN** a user saves an Edit Habit form that changes only `description` or `title`
- **THEN** no transition snackbar SHALL appear

