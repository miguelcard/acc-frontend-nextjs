# Project Guidelines — Accountability App (acc-frontend-nextjs)

## Architecture

Next.js 15 App Router with **static export** (`output: 'export'`) for Capacitor native builds. All pages are client-rendered — no SSR, no Server Actions, no API routes. React 19, MUI v7, TanStack React Query v5, Firebase anonymous auth.

The app is a **web app wrapped in a native shell** via Capacitor. The Next.js `out/` directory (static export) is bundled into the Android/iOS app. There is no server — everything is client-side.

### Layer boundaries (clean architecture)

```
app/                         → Pages (routing only — thin, fetch hooks + layout, no business logic)
components/
  shared/                    → Generic, domain-agnostic building blocks (ContentCard, DialogModal, etc.)
  space/ spaces/ profile/    → Feature-domain components
lib/
  fetch-queries.ts            → All GET API calls (data access layer)
  fetch-mutations.ts          → All POST/PATCH/DELETE API calls (data access layer)
  hooks/queries.ts            → React Query read hooks (wraps fetch-queries)
  hooks/mutations.ts          → React Query write hooks (wraps fetch-mutations + invalidation)
  hooks/use*.ts               → Shared custom hooks (useHabitScorecard, useNetworkStatus)
  utils/                      → Pure functions, no React deps (group-habits-by-space.ts)
  types-and-constants.ts      → All shared types + app-wide constants
  query-keys.ts               → Centralised cache key factory
  authenticated-fetch.ts      → HTTP transport layer (token injection, retry, timeout, App Check)
  query-cache-persister.ts    → Offline cache persistence via @capacitor/preferences
```

**Dependency direction:** `app` → `components` → `lib`. No reverse dependencies. Components never import other components' internals across feature domains. Reusable sub-components (e.g. exported `CreateSpaceDialogTitle`) must be exported from their own module — never duplicated inline.

- **Routing:** Route groups — `(landing)`, `(auth)`, `(authenticated-pages)`. Dynamic space pages use `[...slug]` catch-all with service worker fallback (`public/capacitor-sw.js`) for Capacitor navigation.
- **Providers (root layout):** `CapacitorPluginsInit` → `ThemeRegistry` → `AuthProvider` → `QueryProvider` → `Toaster` → children.
- **Auth flow:** Anonymous Firebase auth on first load. All API calls go through `authenticatedFetch` (`lib/authenticated-fetch.ts`) — injects Bearer token + Firebase App Check header, retries once on 401, aborts after 9 s.
- **State management:** TanStack React Query exclusively. No Redux/Zustand. Query keys centralised in `lib/query-keys.ts`.
- **Offline support:** Query cache persisted to device storage via `lib/query-cache-persister.ts` (`@capacitor/preferences`; no-op on web). Stale data surfaces even without a connection — error screens only show when there is no cached data at all.
- **Network detection:** Always use `useNetworkStatus()` (`lib/hooks/useNetworkStatus.ts`) — never `navigator.onLine` directly (unreliable in Android WebView; uses `@capacitor/network` on native).

## Build and Run

### Web (instant feedback, no Capacitor)
```bash
npm run dev          # http://localhost:3000 — Turbopack, hot reload
```

### Full static build → Android emulator (API at 10.0.2.2:8000)
```bash
npm run cap:android-emulator
# Runs: NEXT_PUBLIC_API=http://10.0.2.2:8000/api next build && cap sync && cap open android
# Press Run ▶ in Android Studio to install on emulator
```

### Live reload in emulator (changes appear without rebuild)
```bash
npm run dev:emulator
# Runs: CAP_LIVE_RELOAD=true cap sync && cap open android && next dev
# Capacitor shell points at http://10.0.2.2:3000 (your dev server)
# Keep the Next.js dev server running; changes appear on save
```

### iOS
```bash
npm run cap:ios      # next build && cap sync && cap open ios
```

### Type check (no test framework configured)
```bash
npx tsc --noEmit
```

**Env vars** (`.env.local`): `NEXT_PUBLIC_API`, `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID` plus other Firebase config vars.

> `next.config.js` only enables `output: 'export'` in production — dev server runs with normal dynamic routing.
> `capacitor.config.ts` reads `CAP_LIVE_RELOAD` env var. **Never hardcode the `server.url` field.**

## Code Style

- All components use `'use client'` directive (static export requirement).
- Path alias: `@/*` maps to project root.
- Component folders: PascalCase (`CreateSpaceModal/`), files: kebab-case (`create-space-modal.tsx`).
- Components organised by feature domain (`space/`, `spaces/`, `profile/`, `auth/`); reusable components in `shared/`.
- Forms: Formik + Yup. Multi-step forms use `FormikStepper` (`components/shared/FormikStepper/`).
- Styling: MUI `sx` prop + CSS modules (`.module.css`). Theme colors — primary: `#84cec1`, secondary: `#655dff`.
- Icons: FontAwesome via `lib/fa-icons-mapper.ts` (icon alias strings like `'trash'`) and MUI Icons.

## Project Conventions

### API / data access
- `lib/fetch-queries.ts` — GET only. `lib/fetch-mutations.ts` — POST/PATCH/DELETE.
- **All API functions return `{ error: GENERIC_ERROR_MESSAGE }` on failure — never throw.** Always check `result?.error` after `mutateAsync`.
- All API calls must go through `authenticatedFetch` — never raw `fetch`.

### React Query
- Query hooks (`lib/hooks/queries.ts`): always guard with `enabled: !authLoading && !!firebaseUser`.
- Mutation hooks (`lib/hooks/mutations.ts`): always `invalidateQueries` on success using `queryKeys.*`. **Invalidate every query key whose data is affected** — e.g. leaving a space must invalidate both `queryKeys.spaces` and `queryKeys.recurrentHabits`.
- New cache keys go in `lib/query-keys.ts` — never inline string arrays.

### Capacitor / native
- All Capacitor plugin calls guarded by `Capacitor.isNativePlatform()`.
- **Dynamic routes:** Use `usePathname()` (not `useParams()`) to extract IDs from the URL. `useParams()` returns the pre-rendered placeholder `_` in Capacitor, not the real value.
- Keyboard: `resize: None` + `adjustNothing` in AndroidManifest — dialogs reposition via CSS (`--keyboard-height` + `.keyboard-open` class), not native resize.

### Utilities
- Pure functions with no React dependencies belong in `lib/utils/`.
- Extend existing utilities with optional parameters rather than creating parallel functions — see `groupHabitsBySpace(habits, spaces, includeEmptySpaces?)` as the canonical example.

## Integration Points

- **Backend:** Django REST API at `NEXT_PUBLIC_API` — all endpoints under `/v1/`. CORS must allow `capacitor://localhost` and `http://localhost` for native.
- **Firebase:** Auth only (anonymous sign-in). No Firestore/Storage. Config in `lib/auth/firebase.ts`. App Check token injected automatically by `authenticatedFetch`.
- **Capacitor plugins:** `@capacitor/splash-screen`, `@capacitor/status-bar`, `@capacitor/keyboard`, `@capacitor/app`, `@capacitor/network`, `@capacitor/preferences` — configured in `capacitor.config.ts`.
- **Android:** Network security config (`android/app/src/main/res/xml/network_security_config.xml`) allows cleartext to `10.0.2.2` for emulator dev.

## Spec-Driven Workflow (openspec)

Feature changes follow the `openspec/` workflow:
- `openspec/changes/` — active change folders (proposal → design → tasks → implementation)
- `openspec/specs/` — canonical capability specs referenced by agents
- `openspec/changes/archive/` — completed changes (read for historical context)

When implementing a change: read `tasks.md` for the checklist, `design.md` for decisions and rejected alternatives, `spec.md` for acceptance criteria. Skills in `.github/skills/` extend agent behaviour for specific workflows (propose, explore, apply-change, archive).
