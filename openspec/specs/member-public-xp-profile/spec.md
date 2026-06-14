### Requirement: Member row is tappable in read-only member list
Any member entry in the read-only `MembersList` component SHALL be tappable (pressable). Tapping an entry SHALL open a modal dialog presenting that member's public XP profile. The tap target SHALL cover the full row (avatar + username + name).

#### Scenario: Tap member row
- **WHEN** a user taps any member row in the members list
- **THEN** a modal dialog opens showing that member's public XP card

#### Scenario: Admin editable list avatar and username are tappable
- **WHEN** the members list is rendered in admin-editable mode (`MembersListEditable`)
- **THEN** tapping the avatar or username/name area opens the public profile modal (the ⋮ admin menu behaviour is unchanged)

---

### Requirement: Public XP card displays member's level and XP progress
The member public XP modal SHALL display: level number, level label, total XP, XP progress bar (XP into level / XP for level), and the percentage to the next level. The layout and visual design SHALL match the owner's own XP card on the profile page.

#### Scenario: Modal renders XP card for a member
- **WHEN** the member profile modal is open
- **THEN** the card shows level number, level label, total XP, a filled progress bar, and the XP breakdown caption (e.g. "340 / 500 XP · to Level 6")

#### Scenario: Loading state while stats are fetching
- **WHEN** the modal is open and the public stats request is in-flight
- **THEN** the card renders the same skeleton loading state used by the owner's XP card

#### Scenario: Error state when stats cannot be loaded
- **WHEN** the public stats request fails or the user is offline
- **THEN** the modal displays a brief error/unavailable message instead of the card

---

### Requirement: Public XP card displays streak and completed periods
The member public XP modal SHALL display the member's longest streak (with unit: weeks or months) and total completed periods, matching the stat pills in the owner's own XP card.

#### Scenario: Stat pills render correctly
- **WHEN** the member profile modal is open and stats have loaded
- **THEN** the "Longest streak" pill shows the streak value with unit suffix (e.g. "8w") and the "Periods completed" pill shows the integer count

---

### Requirement: Public stats are fetched on demand and cached per member
The frontend SHALL fetch public stats only when a member's modal is opened (lazy / on-demand). Stats SHALL be cached by user ID so that re-opening the same member's modal within the same session does not trigger a new network request.

#### Scenario: First open fetches from API
- **WHEN** a user opens a member's profile modal for the first time
- **THEN** a request is made to `GET /v1/users/:id/public-stats/`

#### Scenario: Subsequent open uses cache
- **WHEN** a user closes and reopens the same member's profile modal within the same session
- **THEN** no additional network request is made; cached data is used

---

### Requirement: Modal header identifies the member
The member public XP modal SHALL display the member's username and full name at the top so the viewer knows whose stats they are looking at.

#### Scenario: Modal header shows member identity
- **WHEN** the member profile modal is open
- **THEN** the modal header or title area shows the member's avatar, username, and display name

---

### Requirement: Member XP profile accessible from Weekly Scorecard
Each row in the Weekly Scorecard (MemberLeaderboard) SHALL be tappable. Tapping a row SHALL open the member's public XP profile modal.

#### Scenario: Tap scorecard row
- **WHEN** a user taps any member row in the Weekly Scorecard
- **THEN** a modal dialog opens showing that member's public XP card

---

### Requirement: Member XP profile accessible from habits list
In the per-member habits list (ScoreCard), the member's avatar and username SHALL be tappable to open the public XP profile modal. The collapse/expand arrow SHALL remain the sole control for collapsing that member's habits.

#### Scenario: Tap avatar or username in habits list
- **WHEN** a user taps a member's avatar or username in the habits list
- **THEN** a modal dialog opens showing that member's public XP card

#### Scenario: Collapse arrow is unaffected
- **WHEN** a user taps the collapse arrow
- **THEN** the member's habit rows collapse or expand as before; no XP modal is opened
