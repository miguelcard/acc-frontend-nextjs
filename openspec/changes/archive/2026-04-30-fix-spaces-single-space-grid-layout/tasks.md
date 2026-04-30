## 1. Fix Grid Sizing

- [x] 1.1 In `components/spaces/SpacesOverview/spaces-overview.tsx`, change the `Grid` item `size` prop from `spaces.results.length == 1 ? 12 : { xs: 12, md: 6, lg: 6 }` to always use `{ xs: 12, md: 6, lg: 6 }`.

## 2. Verify

- [x] 2.1 Run the app and confirm a single space card renders at half-width on a medium+ screen.
- [x] 2.2 Confirm two+ space cards still render in the two-column layout unchanged.
- [x] 2.3 Confirm mobile (xs) shows all cards at full width.
