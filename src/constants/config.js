const localhost = 'localhost';
const BASE_URL = `http://${localhost}:${process.env.REACT_APP_SERVER_PORT}/api`;
const EMAIL_REGEXP = /(^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z]+[a-zA-Z0-9]+@[a-zA-Z]+\.com$)/i;

export { EMAIL_REGEXP, BASE_URL, localhost };
