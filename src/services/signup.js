import { post } from './http';

function signupRequest(requestBody) {
  return post('/signup', requestBody);
}


export default signupRequest;