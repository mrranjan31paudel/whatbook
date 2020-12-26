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
  return put(url, requestBody);
}

function deleteContent(url, params = {}) {
  return remove(url, params);
}

function sendRequest(url, requestBody) {
  return post(url, requestBody);
}

function acceptRequest(url, requestBody) {
  return put(url, requestBody);
}

function deleteRequest(url, params = {}) {
  return remove(url, params);
}

function getPeopleList(url, params = {}) {
  return get(url, params);
}

function getFriendList(url, params = {}) {
  return get(url, params);
}

function getRequestList(url, params = {}) {
  return get(url, params);
}

function getNotificationsList(url, params = {}) {
  return get(url, params);
}

function markNotificationAsRead(url, requestBody) {
  return put(url, requestBody);
}

function changeUserData(url, requestBody) {
  return put(url, requestBody);
}

function deleteNotification(url, params = {}) {
  return remove(url, params);
}

export {
  getUserDetails,
  getUserStories,
  createNewPost,
  logoutUser,
  postComment,
  getComments,
  updateContent,
  deleteContent,
  sendRequest,
  acceptRequest,
  deleteRequest,
  getPeopleList,
  getFriendList,
  getRequestList,
  getNotificationsList,
  markNotificationAsRead,
  changeUserData,
  deleteNotification,
};
