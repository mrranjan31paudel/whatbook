function validateSignup(state) {
  const {
    name = '',
    email = '',
    password = '',
    confPassword = ''
  } = state.data;
  const { day = '0', month = '0', year = '0' } = state.data.dob;

  if (
    name.length > 0 &&
    email.length > 0 &&
    password.length > 5 &&
    password === confPassword &&
    day !== '0' &&
    month !== '0' &&
    year !== '0'
  ) {
    return true;
  }

  return false;
}

export default validateSignup;
