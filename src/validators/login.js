function validateLogin(state) {
  const { email = '', password = '' } = state.data;

  if (email && password && email.length > 0 && password.length > 0) {
    return true;
  }

  return false;
}

export default validateLogin;
