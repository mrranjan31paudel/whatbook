import { get, post, put, remove } from './http';

export function postComment(requestBody) {
  return post('/user/comment', requestBody);
}

export function getComments(params = {}) {
  return get('/user/comment', params);
}

export function updateComment(requestBody) {
  return put('/user/comment', requestBody);
}

export function deleteComment(params = {}) {
  return remove('/user/comment', params);
}
