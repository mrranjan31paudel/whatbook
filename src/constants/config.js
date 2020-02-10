const BASE_URL = process.env.REACT_APP_BASE_URL;
const EMAIL_REGEXP = /(^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z]+[a-zA-Z0-9]+@[a-zA-Z]+\.com$)/i;

export { EMAIL_REGEXP, BASE_URL };