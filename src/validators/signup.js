function validateSignup(formData) {
  const {
    name = '',
    email = '',
    password = '',
    confPassword = '',
  } = formData.data;
  const { day = '0', month = '0', year = '0' } = formData.data.dob;

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
