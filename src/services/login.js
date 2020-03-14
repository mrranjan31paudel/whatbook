import { post } from './http';

function loginRequest(requestBody) {
  return post('/login', requestBody);
}

export default loginRequest;
