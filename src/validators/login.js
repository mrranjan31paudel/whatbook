function validateLogin(state) {
  if (
    state.data.email &&
    state.data.password &&
    state.data.email.length > 0 &&
    state.data.password.length > 0
  ) {
    return true;
  }

  return false;
}

export default validateLogin;
