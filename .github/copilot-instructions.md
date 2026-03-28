# Project Guidelines — Accountability App (acc-frontend-nextjs)

## Architecture

Next.js 15 App Router with **static export** (`output: 'export'`) for Capacitor native builds. All pages are client-rendered — no SSR, no Server Actions, no API routes. React 19, MUI v7, TanStack React Query v5, Firebase anonymous auth.

- **Routing:** `app/` uses route groups — `(landing)`, `(auth)`, `(authenticated-pages)`. Dynamic space pages use `[...slug]` catch-all with a service worker fallback (`public/capacitor-sw.js`) for Capacitor navigation.
- **Providers (root layout):** `CapacitorPluginsInit` → `ThemeRegistry` → `AuthProvider` → `QueryProvider` → `Toaster` → children.
- **Auth flow:** Anonymous Firebase auth on first load; all API calls use `authenticatedFetch` wrapper (`lib/authenticated-fetch.ts`) that injects Bearer token and retries on 401.
- **State management:** TanStack React Query exclusively. No Redux/Zustand. Query keys centralized in `lib/query-keys.ts`.

## Code Style

- All components use `'use client'` directive (static export requirement).
- Path alias: `@/*` maps to project root.
- Component folders: PascalCase (`CreateSpaceModal/`), files: kebab-case (`create-space-modal.tsx`).
- Components organized by feature domain (`space/`, `spaces/`, `profile/`, `auth/`); reusable components in `shared/`.
- Forms: Formik + Yup validation schemas. Multi-step forms use `FormikStepper` (`components/shared/FormikStepper/`).
- Styling: MUI `sx` prop + CSS modules (`.module.css`). Theme colors — primary: `#84cec1`, secondary: `#655dff`.
- Icons: FontAwesome (via `lib/fa-icons-mapper.ts`) and MUI Icons.

## Build and Test

```bash
npm run dev                    # Local dev server (Turbopack)
npm run dev:emulator           # Dev server for Android emulator (live reload + cap sync)
npm run cap:android-emulator   # Full static build → cap sync → open Android Studio
npm run cap:ios                # Full static build → cap sync → open Xcode
npx tsc --noEmit               # Type check (no test framework configured)
```

**Env vars** (`.env.local`): `NEXT_PUBLIC_API`, `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, plus other Firebase config vars. For emulator: API overridden to `http://10.0.2.2:8000/api`.

## Project Conventions

- **API functions** in `lib/fetch-queries.ts` (GET) and `lib/fetch-mutations.ts` (POST/PATCH/DELETE). All return `{ error: GENERIC_ERROR_MESSAGE }` on failure — never throw.
- **Query hooks** in `lib/hooks/queries.ts`: always guard with `enabled: !authLoading && !!firebaseUser`.
- **Mutation hooks** in `lib/hooks/mutations.ts`: always `invalidateQueries` on success using keys from `lib/query-keys.ts`.
- **Types** defined in `lib/types-and-constants.ts` — `SpaceT`, `HabitT`, `UserT`, `CheckMarkT`, etc.
- **Capacitor plugins** initialized in `lib/capacitor-plugins.ts`; all calls guarded by `Capacitor.isNativePlatform()`.
- **Dynamic routes in Capacitor:** Use `usePathname()` (not `useParams()`) to extract IDs — `useParams()` returns the pre-rendered placeholder (`_`), not the real URL.
- `capacitor.config.ts` uses `CAP_LIVE_RELOAD` env var to toggle between bundled files and dev server — never hardcode the `url` field.

## Integration Points

- **Backend:** Django REST API at `NEXT_PUBLIC_API` — endpoints under `/v1/`. CORS must allow `capacitor://localhost` and `http://localhost` for native builds.
- **Firebase:** Auth only (anonymous sign-in). No Firestore/Storage on client. Config in `lib/auth/firebase.ts`.
- **Capacitor plugins:** `@capacitor/splash-screen`, `@capacitor/status-bar`, `@capacitor/keyboard`, `@capacitor/app` — configured in `capacitor.config.ts` plugins section.
- **Android:** Network security config (`android/.../xml/network_security_config.xml`) allows cleartext to `10.0.2.2` for emulator dev.
