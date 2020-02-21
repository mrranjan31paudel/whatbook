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

    if (error.response && error.response.status === 401 && error.response.data.msg === 'TOKEN_EXPIRED') {
      console.log('in token expired interceptor');
      if (!token.getRefreshToken()) {
        return Promise.reject(error);
      }

      if (isTokenBeingRefreshed) {
        heldRequests.push(error);
      }
      else {
        heldRequests.push(error);
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
            heldRequests.forEach(element => {
              element.config.headers.authorization = token.getAccessToken();
              axios(element.config);
            });
            heldRequests = [];
          })
          .catch(err => {
            return Promise.reject(err);
          });

      }

    } else {
      return Promise.reject(error);
    }

  }
);

export { get, post, put, remove };