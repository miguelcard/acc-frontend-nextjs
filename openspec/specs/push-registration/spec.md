# push-registration Specification

## Purpose
TBD - created by archiving change push-notifications. Update Purpose after archive.
## Requirements
### Requirement: Request notification permission on native platforms
The app SHALL request push permission on first launch on native platforms and SHALL NOT do so on web.

#### Scenario: Native first launch
- **WHEN** the app starts on Android and permission state is `prompt`
- **THEN** the OS permission dialog is shown

#### Scenario: Permission denied
- **WHEN** the user denies permission
- **THEN** no token is registered and the app works normally

#### Scenario: Web
- **WHEN** the app runs in a browser
- **THEN** no permission is requested and no registration occurs

### Requirement: Register the device token with the backend
The app SHALL send the FCM token to `POST /v1/devices/` for any authenticated user (anonymous or not), including when the token is refreshed.

#### Scenario: Token obtained
- **WHEN** the plugin emits a `registration` event while a user is signed in
- **THEN** the token is posted with platform `android`

#### Scenario: Token refreshed
- **WHEN** a new token is emitted
- **THEN** it is posted again

#### Scenario: Anonymous user
- **WHEN** the signed-in user is anonymous
- **THEN** the token is registered like for any other user

#### Scenario: Anonymous user upgrades to a full account
- **WHEN** an anonymous account is upgraded (same uid)
- **THEN** registration is not repeated and the token stays attached to the same user

### Requirement: Unregister on logout
The app SHALL attempt to delete the device token from the backend when the user signs out.

#### Scenario: Normal logout
- **WHEN** the user signs out while online
- **THEN** `DELETE /v1/devices/` is called and sign-out proceeds

#### Scenario: Offline logout
- **WHEN** the delete request fails
- **THEN** sign-out still completes

