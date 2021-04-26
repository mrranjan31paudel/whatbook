import { post } from './http';

function loginRequest(requestBody) {
  return post('/login', requestBody);
}

export function logoutUser(requestBody) {
  return post('/logout', requestBody);
}

export default loginRequest;
