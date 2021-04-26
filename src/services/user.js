import { get, put } from './http';

function getUserDetails(params = {}) {
  return get('/user', params);
}

function getPeopleList(params = {}) {
  return get('/user/people', params);
}

function changeUserData(requestBody) {
  return put('/user', requestBody);
}

export { getUserDetails, getPeopleList, changeUserData };
