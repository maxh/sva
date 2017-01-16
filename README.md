# scout-voice-app

A mobile app to access your trainable voice assistant.

[spec](https://docs.google.com/document/d/1zzqsojz0pElWXLiUwgDRnK_4kMHD14qYAmkDdwLoXnA/edit#heading=h.xj8kk1760ixc)

## Setup

First, set up [React Native](https://facebook.github.io/react-native/docs/getting-started.html#content). Then clone the repo.

Then run `npm install` and then `react-native link` to install dependencies and link native deps.

From the project's root, run `react-native run-ios` to load the app an iOS emulator.

The [Facebook debugging instructions](https://facebook.github.io/react-native/docs/debugging.html) are pretty useful. Main things: use shake gesture to select "Enable Live Reload" and "Enable Remote JS Debugging". Then go here in your browser:

http://localhost:8081/debugger-ui

And open up DevTools.  This will log stuff in JS-land.  To see logs of stuff in native-land too, run `react-native log-ios` in a separate terminal window.

### Linting

The codebase roughly follows the Airbnb ES6 style guide. Use `npm run lint` and `npm run fix-lint`.

## Technical

The app uses React Native and Redux. This post is a good introduction (watch the videos at x2 speed):

https://medium.com/@jonlebensold/getting-started-with-react-native-redux-2b01408c0053#.v62jfdx8u

## Submitting to app store

https://github.com/oney/react-native-webrtc/blob/master/Documentation/iOSInstallation.md#app-store-submission

## TODO

- Log errors to server for client-side error reporting.
- TypeScript
- Lint
