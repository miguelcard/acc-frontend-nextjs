## Why

The app cannot alert users when they are added to a space while the app is closed. The app is a Capacitor shell (`com.avidhabits.app`) with no push plugin and no device-token registration.

## What Changes

- Add `@capacitor/push-notifications` and Android FCM configuration (`google-services.json`).
- Add a registration lifecycle: request permission on first launch, register the FCM token with the backend, handle token refresh, and unregister on logout.
- Web is a no-op.
- Tapping a notification simply opens the app (no deep link).
- iOS support is deferred until an Apple Developer account and APNs key exist.
- No inbox, bell or read state in this change (deferred).

## Capabilities

### New Capabilities
- `push-registration`: permission request, token registration, refresh and unregistration on native platforms.

### Modified Capabilities

## Impact

- `package.json` (new plugin), `capacitor.config.ts`, `android/app` (google-services).
- New hook `lib/hooks/usePushRegistration.ts`, mutations in `lib/fetch-mutations.ts`, wiring in `lib/auth/auth-context.tsx` (sign-in and sign-out).
- Depends on backend change `push-notifications` (`POST/DELETE /v1/devices/`).
