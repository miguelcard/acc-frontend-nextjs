# Spec: spaces-overview-grid

## Requirements

### Requirement: Space cards use consistent responsive grid sizing
All space cards in the SpacesOverview SHALL render with the same responsive column sizing (`xs: 12, md: 6, lg: 6`) regardless of the total number of spaces.

#### Scenario: Single space renders at half width on medium screens
- **WHEN** the user belongs to exactly one space and views the Spaces tab on a medium or larger screen
- **THEN** the space card SHALL occupy 6 of 12 grid columns (50% width), identical to how it would appear if a second space card were present

#### Scenario: Multiple spaces render consistently
- **WHEN** the user belongs to two or more spaces
- **THEN** each space card SHALL occupy 6 of 12 grid columns on medium+ screens, unchanged from existing behavior

#### Scenario: Mobile layout unchanged
- **WHEN** the user views the Spaces tab on an extra-small screen (xs)
- **THEN** all space cards SHALL occupy the full row width (12 columns), regardless of count
