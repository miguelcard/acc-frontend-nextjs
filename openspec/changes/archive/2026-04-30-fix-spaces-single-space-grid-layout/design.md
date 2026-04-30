## Context

The `SpacesOverview` component renders user spaces in an MUI `Grid`. Each space is a `Grid` item whose `size` prop is currently set conditionally: `size={spaces.results.length == 1 ? 12 : { xs: 12, md: 6, lg: 6 }}`. A size of `12` means full-width on all breakpoints, while `{ xs: 12, md: 6, lg: 6 }` gives a two-column layout on medium+ screens. This makes a single space look noticeably wider than it would in a multi-space context.

## Goals / Non-Goals

**Goals:**
- All space cards use the same responsive `Grid` column sizing regardless of total count.
- A single space card renders identically in layout to how it would appear alongside a second card.

**Non-Goals:**
- Changing card content, design, or spacing.
- Adding pagination, carousels, or sorting.
- Changing breakpoints or column counts beyond the existing pattern.

## Decisions

**Always use `{ xs: 12, md: 6, lg: 6 }` for every space card.**

The conditional logic `spaces.results.length == 1 ? 12 : ...` was likely added as a "fill available width" convenience for solo spaces. However, the resulting layout is inconsistent and the card looks oversized. Removing the condition and always using the responsive object is the simplest, most consistent fix. No alternative sizing strategy is needed — the existing two-column responsive sizing is already the desired target state.

## Risks / Trade-offs

- [Visual change for existing single-space users] → Intentional improvement; cards will now appear at half-width on medium+ screens, matching the multi-space layout.
- [No risk of regression] → Change is isolated to a single prop value in one component.
