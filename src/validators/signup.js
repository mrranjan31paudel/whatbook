function validateSignup(state) {
  const name = !state.data.name ? '' : state.data.name;
  const email = !state.data.email ? '' : state.data.email;
  const password = !state.data.password ? '' : state.data.password;
  const confPassword = !state.data.confPassword ? '' : state.data.confPassword;
  const day = !state.data.dob.day ? '0' : state.data.dob.day;
  const month = !state.data.dob.month ? '0' : state.data.dob.month;
  const year = !state.data.dob.year ? '0' : state.data.dob.year;

  if (name.length > 0 && email.length > 0 && password.length > 5 && password === confPassword && day !== '0' && month !== '0' && year !== '0') {
    return true;
  }

  return false;
}

export default validateSignup;