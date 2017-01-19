import LocalIP from './settings-local-ip';

const settings = {};

if (__DEV__) {
  settings.port = 5000;
  settings.urls = {
    mainServer: `http://${LocalIP.ip}:${settings.port}`,
    binaryServer: `ws://${LocalIP.ip}:${settings.port}`,
  };
} else {
  // TODO(max): Use prod here when it's ready.
  const host = 'scout-loftboxlabs-staging.herokuapp.com';
  settings.urls = {
    mainServer: `https://${host}`,
    binaryServer: `wss://${host}`,
  };
}

// Change these during development to purge the store upon app refresh.
settings.dev = {
  purgeStore: false,
  forceGoogleSignOut: false,
};

// Safety check to prevent misconfiguration in production.
if (!__DEV__) {
  settings.dev = {
    purgeStore: false,
    forceGoogleSignOut: false,
  };
}

export default settings;
