import { get, post, put, remove } from './http';

function getUserDetails(params = {}) {
  return get('/user', params);
}

function createNewPost(requestBody) {
  return post('/user/post', requestBody);
}

function logoutUser(requestBody) {
  return post('/logout', requestBody);
}

function getUserStories(params = {}) {
  return get('/user/post', params);
}

function postComment(requestBody) {
  return post('/user/comment', requestBody);
}

function getComments(params = {}) {
  return get('/user/comment', params);
}

function updateComment(requestBody) {
  return put('/user/comment', requestBody);
}

function updatePost(requestBody) {
  return put('/user/post', requestBody);
}

function deleteComment(params = {}) {
  return remove('/user/comment', params);
}

function deletePost(params = {}) {
  return remove('/user/post', params);
}

function sendRequest(requestBody) {
  return post('/user/friend', requestBody);
}

function acceptRequest(requestBody) {
  return put('/user/friend', requestBody);
}

function deleteRequest(params = {}) {
  return remove('/user/friend', params);
}

function getPeopleList(params = {}) {
  return get('/user/people', params);
}

function getFriendList(params = {}) {
  return get('/user/friend', params);
}

function getRequestList(params = {}) {
  return get('/user/requests', params);
}

function getNotificationsList(params = {}) {
  return get('/user/notifications', params);
}

function markNotificationAsRead(requestBody) {
  return put('/user/notifications', requestBody);
}

function changeUserData(requestBody) {
  return put('/user', requestBody);
}

function deleteNotification(params = {}) {
  return remove('/user/notifications', params);
}

export {
  getUserDetails,
  getUserStories,
  createNewPost,
  logoutUser,
  postComment,
  getComments,
  updateComment,
  updatePost,
  deleteComment,
  deletePost,
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
