import { postRequest } from './http';

function loginRequest(requestBody) {
  return postRequest('/login', requestBody);
}

export default loginRequest;