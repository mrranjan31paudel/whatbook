import axios from 'axios';
import token from './token';
// import { BASE_URL } from '../constants/config';
import { BASE_URL } from './../constants/config';
// const BASE_URL = 'http://localhost:9090/api';

function get(url, params = {}) {
  return axios({
    method: 'GET',
    url: BASE_URL + url,
    params: params,
    headers: getRequestHeader()
  });
}

function post(url, data) {
  console.log('base:url:', BASE_URL);
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
    console.log('in interceptor response');
    return response;
  },
  error => {
    console.log('in interceptor error: ', error.response.data.msg);

    if (error.response && error.response.status === 401 && error.response.data.msg === 'TokenExpiredError') {
      if (!token.getRefreshToken()) {
        console.log('in interceptor error if ');
        return Promise.reject(error);
      }

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
          console.log('in interceptor error res');
          token.setTokens(res.data.accessToken, res.data.refreshToken);

          error.config.headers.authorization = token.getAccessToken();

          return axios(error.config);
        })
        .catch(err => {
          console.log('in interceptor error err');
          return Promise.reject(err);
        });
    }
    return Promise.reject(error);
  }
);

export { get, post, put, remove };