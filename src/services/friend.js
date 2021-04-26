import { get, post, put, remove } from './http';

export function sendRequest(requestBody) {
  return post('/user/friend', requestBody);
}

export function acceptRequest(requestBody) {
  return put('/user/friend', requestBody);
}

export function deleteRequest(params = {}) {
  return remove('/user/friend', params);
}

export function getFriendList(params = {}) {
  return get('/user/friend', params);
}

export function getRequestList(params = {}) {
  return get('/user/requests', params);
}
