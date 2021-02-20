/**
 * Load credentials from session storage
 */
export function fetchCredentials() {
  const credentials = sessionStorage.getItem('credentials');
  if (credentials) {
    return JSON.parse(credentials);
  }
  return undefined;
}

/**
    * Store credentials in session storage.
    */
export function storeCredentials(accessToken, uid, client) {
  const credentials = {
    'access-token': accessToken,
    uid,
    client,
    'token-type': 'Bearer',
  };

  sessionStorage.setItem('credentials', JSON.stringify(credentials));
}

/**
 * Is user currently logged
 * @return {Boolean} true if logged, false otherwise
 */
export function isLogged() {
  return fetchCredentials();
}
