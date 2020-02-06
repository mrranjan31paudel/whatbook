function getAccessToken() {
  return localStorage.getItem('myAccessToken');
}

function getRefreshToken() {
  return localStorage.getItem('myRefreshToken');
}

function setTokens(accessToken, refreshToken) {
  localStorage.setItem('myAccessToken', accessToken);
  localStorage.setItem('myRefreshToken', refreshToken);
}

function removeTokens() {
  localStorage.removeItem('myAccessToken');
  localStorage.removeItem('myRefreshToken');
}

export default { getAccessToken, getRefreshToken, setTokens, removeTokens };