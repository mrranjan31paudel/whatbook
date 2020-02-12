import { get, post, put, remove } from './http';

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

function postComment(url, requestBody) {
  return post(url, requestBody);
}

function getComments(url, params = {}) {
  return get(url, params);
}

function updateContent(url, requestBody) {
  return put(url, requestBody)
}

function deleteContent(url, params = {}) {
  return remove(url, params);
}

export { getUserDetails, getUserStories, createNewPost, logoutUser, postComment, getComments, updateContent, deleteContent };