import { get, post, put, remove } from './http';

export function createNewPost(requestBody) {
  return post('/user/post', requestBody);
}

export function getUserStories(params = {}) {
  return get('/user/post', params);
}

export function updatePost(requestBody) {
  return put('/user/post', requestBody);
}

export function deletePost(params = {}) {
  return remove('/user/post', params);
}
