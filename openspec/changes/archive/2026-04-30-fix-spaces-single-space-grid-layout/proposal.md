## Why

When a user belongs to only one space, the Spaces tab renders that space card at full width (`Grid size={12}`), making it look visually inconsistent with the two-column card layout shown when two or more spaces exist. This inconsistency is confusing and makes the UI feel unpolished.

## What Changes

- Remove the conditional `size` logic that forces a single space card to full width.
- Always render space cards with `{ xs: 12, md: 6, lg: 6 }` responsive sizing so a single space card matches the layout of multi-space views.

## Capabilities

### New Capabilities
<!-- None introduced -->

### Modified Capabilities
- `spaces-overview-grid`: The grid sizing rule for space cards no longer varies based on the number of spaces — all cards use the same responsive column widths.

## Impact

- `components/spaces/SpacesOverview/spaces-overview.tsx` — one-line change to the `Grid` `size` prop.
- No API, state, or dependency changes.
