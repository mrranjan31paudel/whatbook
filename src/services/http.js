import axios from 'axios';
import token from './token';
import { BASE_URL } from './../constants/config';

let isTokenBeingRefreshed = false;
let heldRequests = [];

function get(url, params = {}) {
  return axios({
    method: 'GET',
    url: BASE_URL + url,
    params: params,
    headers: getRequestHeader()
  });
}

function post(url, data) {
  return axios({
    method: 'POST',
    url: BASE_URL + url,
    data: data,
    headers: getRequestHeader()
  });
}

function put(url, data) {
  return axios({
    method: 'PUT',
    url: BASE_URL + url,
    data: data,
    headers: getRequestHeader()
  });
}

function remove(url, params = {}) {
  return axios({
    method: 'DELETE',
    url: BASE_URL + url,
    params: params,
    headers: getRequestHeader()
  });
}

function getRequestHeader() {
  let accessToken = token.getAccessToken();
  if (accessToken == null) {
    return;
  }
  return {
    authorization: accessToken
  };
}

axios.interceptors.response.use(
  response => {
    return response;

  },
  error => {
    const newRequest = error.config;
    if (error.response && error.response.status === 401 && error.response.data.msg === 'TOKEN_EXPIRED') {

      if (!token.getRefreshToken()) {
        token.removeTokens();
        return Promise.reject(error);
      }

      if (isTokenBeingRefreshed) {
        return new Promise((resolve, reject) => {
          heldRequests.push({ resolve, reject });
        })
          .then(newToken => {
            newRequest.headers.authorization = newToken;
            return axios(newRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          })

      }

      isTokenBeingRefreshed = true;

      return axios({
        method: 'POST',
        url: BASE_URL + '/tokenrenew',
        data: {
          accessToken: token.getAccessToken(),
          refreshToken: token.getRefreshToken()
        },
        headers: getRequestHeader()
      })
        .then(res => {
          isTokenBeingRefreshed = false;
          token.setTokens(res.data.accessToken, res.data.refreshToken);
          newRequest.headers.authorization = res.data.accessToken;
          releaseHeldRequests(null, res.data.accessToken);
          return axios(newRequest);
        })
        .catch(err => {
          if (err.response.status === 401) {
            token.removeTokens();
            return Promise.reject(err);
          }
          releaseHeldRequests(err, null);
        });

    }
    else {
      return Promise.reject(error);
    }
  }
);

function releaseHeldRequests(err, refreshedAccessToken = null) {
  heldRequests.forEach(elementPromise => {
    if (err) {
      elementPromise.reject(err);
    }
    else {
      elementPromise.resolve(refreshedAccessToken)
    }
  });

  heldRequests = [];
}

export { get, post, put, remove };