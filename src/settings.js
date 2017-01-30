import LocalIP from './settings-local-ip';

const settings = {};

const FORCE_PROD_SERVICE = true;

if (!FORCE_PROD_SERVICE && __DEV__) {
  settings.port = 5000;
  settings.urls = {
    mainServer: `http://${LocalIP.ip}:${settings.port}`,
    binaryServer: `ws://${LocalIP.ip}:${settings.port}`,
  };
} else {
  const host = 'scout-service.herokuapp.com';
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
