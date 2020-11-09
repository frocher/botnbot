/**
  * Compute API base url.
  */
function baseUrl() {
  return '/api/';
}

/**
* Build a query string from a params object.
*/
function getQueryString(params) {
  const queryParts = [];

  for (let param in params) {
    const value = params[param];
    param = window.encodeURIComponent(param);

    if (value !== null) {
      param += `=${window.encodeURIComponent(value)}`;
    }

    queryParts.push(param);
  }

  return queryParts.join('&');
}

export function getFullPath(path) {
  const port = window.location.port ? `:${window.location.port}` : '';
  const full = `${window.location.protocol}//${window.location.hostname}${port}`;
  return `${full}/${path}`;
}

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
  * Build an absolute URL from a partial url and query parameters
  */
export function getRequestUrl(url, params) {
  const queryString = getQueryString(params);
  if (queryString) {
    return `${baseUrl() + url}?${queryString}`;
  }
  return baseUrl() + url;
}

/**
 * Is user currently logged
 * @return {Boolean} true if logged, false otherwise
 */
export function isLogged() {
  return fetchCredentials();
}

/**
  * Perform a XMLHttpRequest
  * @param {Object} parameters
  */
export function getResource(rq) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', (e) => {
    rq.onLoad.call(this, e);
  });

  xhr.addEventListener('error', (e) => {
    if (rq.onError) {
      rq.onError.call(this, e);
    } else {
      this.dispatch('updateMessage', 'Network failure. Try again.');
    }
  });

  xhr.open(rq.method, rq.url);

  let headers = fetchCredentials() || {};
  if (rq.headers) {
    headers = Object.assign(headers, rq.headers);
  }
  for (let header in headers) {
    if (headers[header]) {
      xhr.setRequestHeader(header, headers[header].toString());
    }
  }

  xhr.send();
}
