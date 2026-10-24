## Context

Next.js static export wrapped by Capacitor (`com.avidhabits.app`). Auth is Firebase, exposed through `lib/auth/auth-context.tsx` (`onAuthStateChanged`, `signOut`). API calls go through `lib/authenticated-fetch.ts` and `lib/fetch-mutations.ts`. No push plugin is installed.

## Goals / Non-Goals

**Goals:**
- Native Android push registration lifecycle tied to login/logout.
- Safe no-op on web.

**Non-Goals:**
- Inbox, bell, read state, deep-link on tap, foreground in-app banners.
- iOS (deferred until Apple Developer account and APNs key).

## Decisions

- **`@capacitor/push-notifications`** with FCM on Android. Native FCM token is sent to the backend (not the web Firebase Messaging SDK).
- **Hook `usePushRegistration`** mounted once in the authenticated layout. Runs only when `Capacitor.isNativePlatform()` and a signed-in user exists (anonymous or not; keyed on uid only).
- **Permission asked on first launch** as requested. If denied, the app continues silently and retries on next launch only if status is still `prompt`.
- **Token lifecycle:** on `registration` event, call `POST /v1/devices/`; on token refresh, re-register. On sign-out, call `DELETE /v1/devices/` before signing out, best effort, then `PushNotifications.unregister()`.
- **Tap behavior:** default, opens the app. Foreground pushes are ignored in v1.
- **Mutations** live in `lib/fetch-mutations.ts`, matching the existing pattern.

## Risks / Trade-offs

- [Unregister fails offline, leaving a stale token on the server] → server re-assigns tokens on next registration and prunes invalid ones.
- [Prompting on first launch lowers opt-in rate] → accepted; can be moved after login later without architecture changes.
- [Android 13+ requires runtime POST_NOTIFICATIONS permission] → handled by the plugin request flow.
