import settings from '../settings';
import { fetchJson } from '../infra/net';

export const getJwt = (deviceToken) => {
  const url = `${settings.urls.mainServer}/auth/jwt/fromdevicetoken`;
  const options = {
    method: 'POST',
    headers: { Authorization: `Scout DeviceToken ${deviceToken}`, 'Content-Type': 'text/plain'},
  };
  return fetchJson(url, options).then(result => result.jwt);
};
