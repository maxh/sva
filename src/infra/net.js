// Networking utilities.

export const fetchJson = (url, options) => {
  return fetch(url, options).then(response => {
    if (response.ok) {
      return response.json();
    }

    // Give as much error information as we can.
    const jsonErrorPromise = response.json().then(json => {
      return JSON.stringify(json);
    }).catch(e => 'Unable to parse JSON error message.');
    return jsonErrorPromise.then(jsonError => {
      throw Error(
        `Network request failed!\n` +
        `URL: ${url}\n` +
        `Options: ${JSON.stringify(options)}\n` +
        `Status code: ${response.status}\n` +
        `Status text: ${response.statusText}\n` +
        `JSON body: ${jsonError}\n`
      );
    });
  });
};
