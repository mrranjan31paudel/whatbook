const { http } = require('./../configs/lib.imports');

function loginRequest(requestBody){
  return new Promise((resolve, reject) => {
      http.post('/login', requestBody)
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      });
  })
}

function signupRequest(requestBody){
  return new Promise((resolve, reject) => {
      http.post('/signup', requestBody)
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      });
  })
}

module.exports = {loginRequest, signupRequest};