# ScoutVoiceApp

[Specification](https://docs.google.com/document/d/1zzqsojz0pElWXLiUwgDRnK_4kMHD14qYAmkDdwLoXnA/edit#heading=h.xj8kk1760ixc)

## Local setup

First, set up [React Native](https://facebook.github.io/react-native/docs/getting-started.html#content). Then clone the repo.

Then run `npm install` and then `react-native link` to install dependencies and link native deps.

From the project's root, run `react-native run-ios` to load the app an iOS emulator.

### Clean up logs

The [Facebook debugging instructions](https://facebook.github.io/react-native/docs/debugging.html) are pretty useful. Main things: use shake gesture to select "Enable Live Reload" and "Enable Remote JS Debugging". Then go here in your browser:

http://localhost:8081/debugger-ui

And open up DevTools.  This will log stuff in JS-land.  To see logs of stuff in native-land too, run `react-native log-ios` in a separate terminal window.  When I first did this I got a bunch of errors like:

    <Error>: [] __nw_connection_get_connected_socket_block_invoke 122 Connection has no connected handler

Follow these instructions to get rid of that:
http://stackoverflow.com/questions/37800790/hide-strange-unwanted-xcode-8-logs/39461256#39461256

See this for discussion:
https://github.com/facebook/react-native/issues/10027

## Technical

The app uses React Native and Redux. This post is a good introduction (watch the videos at x2 speed):

https://medium.com/@jonlebensold/getting-started-with-react-native-redux-2b01408c0053#.v62jfdx8u

### Sign in

https://github.com/devfd/react-native-google-signin

#### Syncing with backend

Best practices for syncing our auth with our custom backend:

https://developers.google.com/identity/sign-in/ios/backend-auth
