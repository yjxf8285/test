/**
 * 统一请求方式
 */
const axios = require('axios');
const httpConstants = require('../constants/http');

const HTTP_METHOD = httpConstants.HTTP_METHOD;
const HTTP_RESPONSE_STATE = httpConstants.HTTP_RESPONSE_STATE;

/**
 * axios
 *
 * https://github.com/mzabriskie/axios
 * Example:
 *
 * const httpConstants = require('path/to/constants/http');
 * const httpProxy = require('path/to/httpProxy');
 *
 * const HTTP_METHOD = httpConstants.HTTP_METHOD;
 * const HTTP_RESPONSE_STATE = httpConstants.HTTP_RESPONSE_STATE;
 *
 * const response = await httpProxy.request(url, HTTP_METHOD.POST, { data }); // POST
 * // TODO: handle response { code, data, message }
 *
 * const response = await httpProxy.request(url); // GET
 * // TODO: handle response { code, data, message }
 */
function httpProxy(url, method = HTTP_METHOD.GET, data = {}, credentials = false) {
  const options = {
    url,
    method,
    headers: {
      //'Authorization': sessionId,
      //'cache-control': 'no-cache',
    },
    withCredentials: credentials
  };

  if (method !== HTTP_METHOD.GET) {
    options.headers['Accept'] = 'application/json';
    options.headers['Content-Type'] = 'application/json;charset=UTF-8';
    options.data = data;
  } else if (method === HTTP_METHOD.GET) {
    options.params = data;
  } else {
    throw new Error(`Unknown HTTP Method: ${ method }`);
  }

  return axios(options);
}

httpProxy.request = async (url, method, data, credentials) => {
  try {
    const response = await httpProxy(url, method, data, credentials);
    if (response.status < 200 || response.status >= 300) {
      const err = new Error(`HTTP(${url}) ERROR(${response.statusText})`);
      err.code = response.status;

      throw err;
    }

    return response.data;
  } catch (e) {
    /* handle error */
    const err = new Error(`API SERVER ERROR: ${ e.message }`);
    err.innerError = e;
    err.code = HTTP_RESPONSE_STATE.SERVER_ERROR;

    throw err;
  }
};

export default httpProxy;
