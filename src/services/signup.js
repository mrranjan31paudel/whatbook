import { postRequest } from './http';

function signupRequest(requestBody) {
  return postRequest('/signup', requestBody);
}


export default signupRequest;