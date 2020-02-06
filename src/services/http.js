import axios from 'axios';
import token from './token';

const baseUrl = 'http://localhost:9090/api';

function getRequest(url, params = {}) {
  return axios({
    method: 'GET',
    url: baseUrl + url,
    params: params,
    headers: getRequestHeader()
  });
}

function postRequest(url, data) {
  return axios({
    method: 'POST',
    url: baseUrl + url,
    data: data,
    headers: getRequestHeader()
  });
}

function putRequest(url, data) {
  return axios({
    method: 'PUT',
    url: baseUrl + url,
    data: data,
    headers: getRequestHeader()
  });
}

function deleteRequest(url) {
  return axios({
    method: 'DELETE',
    url: baseUrl + url,
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
//Interceptors
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
        url: baseUrl + '/tokenrenew',
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

export { getRequest, postRequest, putRequest, deleteRequest };