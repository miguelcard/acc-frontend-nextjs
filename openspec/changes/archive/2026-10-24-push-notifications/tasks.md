## 1. Plugin and Android setup

- [x] 1.1 Add `@capacitor/push-notifications` and run `npx cap sync`
- [x] 1.2 Add Firebase `google-services.json` and the Gradle google-services plugin to `android/`
- [x] 1.3 Add Push Notifications config to `capacitor.config.ts` if required

## 2. Registration lifecycle

- [x] 2.1 Add `registerDevice` and `unregisterDevice` to `lib/fetch-mutations.ts`
- [x] 2.2 Implement `lib/hooks/usePushRegistration.ts` (native only, any signed-in user, permission, registration and refresh events)
- [x] 2.3 Mount the hook in the authenticated layout
- [x] 2.4 Call unregister on sign-out in `auth-context.tsx` (best effort, never blocks sign-out)
- [x] 2.5 Unit tests for the hook with the plugin mocked (denied, anonymous, upgrade, web, refresh)

## 3. Verification

- [x] 3.1 End-to-end on a real Android device with the app closed (coordinated with backend task 4.2)

## 4. iOS (deferred)

- [ ] 4.1 Create APNs key, upload to Firebase, add Push capability and `GoogleService-Info.plist`
