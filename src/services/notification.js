import { get, put, remove } from './http';

export function getNotificationsList(params = {}) {
  return get('/user/notifications', params);
}

export function markNotificationAsRead(requestBody) {
  return put('/user/notifications', requestBody);
}

export function deleteNotification(params = {}) {
  return remove('/user/notifications', params);
}
