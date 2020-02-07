import { get, post } from './http';

function getUserDetails(url, params = {}) {
  return get(url, params);
}

function createNewPost(url, requestBody) {
  return post(url, requestBody);
}

function logoutUser(url, requestBody) {
  return post(url, requestBody);
}

function getUserStories(url, params = {}) {
  return get(url, params);
}

export { getUserDetails, getUserStories, createNewPost, logoutUser };