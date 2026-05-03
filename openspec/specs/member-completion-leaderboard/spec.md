## Requirements

### Requirement: Member completion leaderboard card with SVG ring
The ScoreCard SHALL display a collapsible card titled "Weekly Scorecard" (centered) above the `DatesRangeSelector` showing each space member's aggregated habit completion for the current period.

Each member row SHALL show:
- The member's avatar
- The member's username (bold; accented with `secondary` color for the current user)
- A 28px SVG stroke-dasharray completion ring on the far right

The ring SHALL use a continuous green scale (`rgba(45, 195, 140, alpha)`) when partially complete and turn gold (`#FFD700`) with a persistent drop-shadow glow when 100% complete.

No percentage label or numeric value is shown.

Members SHALL be displayed in descending order of completion score. The current user's row SHALL be visually distinguished by bold username and `secondary` color accent.

The card SHALL be **expanded by default** (not collapsed).

A collapse toggle (chevron icon) SHALL be shown in the card header; tapping it collapses/expands the member list.

#### Completion animation
When a member's score transitions from < 1.0 to ≥ 1.0, the ring SHALL play one of two randomly selected animations:
- **pop**: scale bounce (1 → 1.6 → 0.85 → 1.1 → 1, 0.6s) with gold glow
- **bounce**: physics ball bounce with squash on impact (0.9s + squash `scaleX: 1.35 scaleY: 0.65`) with gold glow

The animation fires once per completion event (when score crosses 1.0) and resets after 1100ms.

#### Scenario: All members shown
- **WHEN** a space has 3 members and the user opens the ScoreCard
- **THEN** the leaderboard SHALL show all 3 members with their respective completion rings

#### Scenario: Member with no habits this period
- **WHEN** a member has no habits in the space
- **THEN** their leaderboard entry SHALL show an empty ring (0% fill)

#### Scenario: Sorted by completion
- **WHEN** alice is at 90%, bob at 40%, and the current user at 65%
- **THEN** the order SHALL be alice, current user, bob

#### Scenario: Current user highlighted
- **WHEN** the current user views the leaderboard
- **THEN** their username SHALL be bold and accented with the secondary theme color

#### Scenario: Completion ring turns gold
- **WHEN** a member reaches 100% completion
- **THEN** the ring SHALL turn gold with a glow and play a random pop or bounce animation
