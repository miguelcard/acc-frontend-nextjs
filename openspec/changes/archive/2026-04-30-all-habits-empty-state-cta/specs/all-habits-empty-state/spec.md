## ADDED Requirements

### Requirement: Show contextual empty state when user has no spaces
When the user has no spaces at all, the all-habits page SHALL display a message explaining that a space is needed first, along with a CTA button that opens the Create Space modal inline (not a page navigation), so the user can create a space without leaving the page.

#### Scenario: No spaces and no habits
- **WHEN** the user visits the all-habits page and has zero spaces
- **THEN** the page SHALL show a card with a "Create a Space" button that opens the Create Space `DialogModal` directly without navigating away

### Requirement: Show all spaces including those without user habits
The all-habits page SHALL display every space the user is a member of, regardless of whether the user has any habits in that space. Spaces with habits SHALL appear before spaces without habits. Within each group, spaces SHALL be sorted alphabetically by name.

#### Scenario: User has spaces but no habits in some
- **WHEN** the user has spaces but one or more spaces contain no habits created by the user
- **THEN** each space without habits SHALL still appear in the list, after all spaces that have habits

#### Scenario: Spaces with habits ordered before empty spaces
- **WHEN** both spaces-with-habits and spaces-without-habits exist
- **THEN** spaces with at least one habit SHALL be listed first, followed by spaces with no habits

#### Scenario: User has spaces but no habits anywhere
- **WHEN** the user has spaces but has created no habits in any of them
- **THEN** all spaces SHALL appear in the list, each represented as a chip in the compact strip

### Requirement: Inline "Add habit" CTA per space with no habits
Spaces where the user has no own habits SHALL NOT receive a full header + content card. Instead, they SHALL appear in a compact chip strip below the habit list. Each chip shows the space's icon and name and, when clicked, opens the `CreateHabitDialogModal` pre-scoped to that space. The strip is preceded by the label "Add your own habits in more spaces:" with no additional icon.

#### Scenario: Empty spaces rendered as chip strip
- **WHEN** one or more spaces have no habits from the current user
- **THEN** those spaces SHALL be rendered as clickable outlined chips in a strip below the spaces-with-habits list, preceded by the label "Add your own habits in more spaces:"
- **AND** each chip SHALL display the space's FontAwesome icon (from `icon_alias`) and its name
- **AND** the chip strip SHALL have no background card (transparent, not inside a `ContentCard`)

#### Scenario: Space with habits is unaffected
- **WHEN** a space has at least one habit from the current user
- **THEN** the space SHALL render its full header + scorecard card as before, with no change

#### Scenario: Chip click opens habit creation modal
- **WHEN** the user taps a chip in the strip
- **THEN** the `CreateHabitDialogModal` SHALL open pre-scoped to the corresponding space

### Requirement: Graceful handling of deleted spaces
If a habit references a space ID that no longer exists (e.g. the space was deleted), the all-habits page SHALL NOT crash. Instead, the habit SHALL be rendered under a placeholder space named "(Deleted Space)" with a `trash` icon alias, so the user can still see and manage those habits.

#### Scenario: Habit belongs to a deleted space
- **WHEN** a habit's `spaces` array contains an ID that is not present in the user's current space list
- **THEN** the habit SHALL appear under a "(Deleted Space)" group header instead of being hidden or causing a runtime error

### Requirement: `groupHabitsBySpace` supports empty-space inclusion
The `groupHabitsBySpace` utility SHALL accept an optional `includeEmptySpaces` boolean parameter (default `false`). When `true`, spaces with no matching habits SHALL be appended to the result with an empty habits array, after all spaces that have habits.
