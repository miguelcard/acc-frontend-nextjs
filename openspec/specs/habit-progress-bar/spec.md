## Requirements

### Requirement: Left-edge vertical fill bar per habit
For each habit row in the ScoreCard, the system SHALL display a 4px-wide vertical fill bar anchored to the left edge of the habit card showing the ratio of checkmarks completed in the current period vs. the habit's goal (`times`), where "current period" is defined by the habit's `time_frame` (current calendar week for `W`, current calendar month for `M`).

The bar SHALL fill from **bottom to top** as progress increases (0% = empty track, 100% = fully filled).

The bar color SHALL use a single continuous green scale (`habitProgressGreen(ratio)`) — a transparent-to-solid shade of `#2dc38c` — where:
- ratio 0 → near-transparent green (alpha ~0.08)
- ratio 1 → full `#2dc38c`

No red or yellow is used. The track background is a faint grey (`rgba(150,150,150,0.15)`).

Border-radius: rounded at the bottom corners at all times; all four corners rounded only when 100% complete.

Progress SHALL be capped at 100% visually even if checkmarks exceed the goal. Height and color SHALL animate with `transition: 0.4s ease` on every checkbox toggle.

The bar is implemented as an absolutely-positioned child element inside the habit row `Box` (which has `position: relative`, `overflow: hidden`, `borderRadius: 8px`, and extra `paddingLeft` to preserve content spacing away from the bar).

#### Scenario: Habit with no checkmarks this period
- **WHEN** a user has a weekly habit with goal 3 and zero checkmarks in the current week
- **THEN** the bar SHALL be near-invisible (near-transparent green, 0% height fill)

#### Scenario: Habit partially completed
- **WHEN** a user has a weekly habit with goal 4 and 2 checkmarks in the current week (50%)
- **THEN** the bar SHALL show the lower 50% of its height filled in mid-opacity green

#### Scenario: Habit goal met
- **WHEN** a user has a weekly habit with goal 3 and 3 or more checkmarks in the current week
- **THEN** the bar SHALL be fully filled with `#2dc38c` green

#### Scenario: Monthly habit progress
- **WHEN** a habit has `time_frame: "M"` and 8 of 10 goal checkmarks in the current calendar month
- **THEN** the bar SHALL reflect 80% fill regardless of the selected date range in the date selector

#### Scenario: Progress visible for all members
- **WHEN** any member of a space views the ScoreCard
- **THEN** they SHALL see the left-edge fill bar for all members' habits (not only their own)
