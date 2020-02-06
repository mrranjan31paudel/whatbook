import { getRequest, postRequest } from './http';

function userHomeRequest(url, params = {}) {
  return getRequest(url, params);
}

function userPostRequest(url, requestBody) {
  return postRequest(url, requestBody);
}

function userLogoutRequest(url, requestBody) {
  return postRequest(url, requestBody);
}

export { userHomeRequest, userPostRequest, userLogoutRequest };