import { fetchCredentials } from './credentials';
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
