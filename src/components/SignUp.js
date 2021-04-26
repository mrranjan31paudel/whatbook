import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import Label from './Label';
import Header from './Header';
import Button from './Button';
import Dropdown from './Dropdown';
import TextField from './TextField';
import signupRequest from '../services/signup';
import tokenService from './../services/token';
import { EMAIL_REGEXP } from './../constants/config';
import NoServerConnection from './NoServerConnection';
import { MONTH_OPTIONS, DAY_OPTIONS, YEAR_OPTIONS } from '../constants/dob';

import './../styles/loginsignup/form_wrapper.css';
import './../styles/loginsignup/signup_success_wrapper.css';

class Register extends React.Component {
  constructor() {
    super();

    const today = new Date();
    this.state = {
      formData: {
        name: '',
        dob: {
          year: `${today.getFullYear()}`,
          month: `${today.getMonth() + 1}`,
          day: `${today.getDate()}`,
        },
        email: '',
        password: '',
        confPassword: '',
      },
      errors: {
        name: false,
        dob: false,
        email: false,
        emailFormat: false,
        password: false,
        passwordFormat: false,
        confPassword: false,
      },
      isWaitingServer: false,
      isSignUpSuccessful: false,
      userAlreadyExist: false,
      isConnectedToServer: true,
    };
  }

  componentDidMount() {
    if (tokenService.getAccessToken()) {
      return this.props.history.push('/user');
    }
  }

  handleChange = (targetField, value) => {
    this.setState((state) => ({
      formData: {
        ...state.formData,
        [targetField]: value,
      },
    }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const { formData } = this.state;

    const toSendData = {
      name: formData.name,
      dob: [formData.dob.year, formData.dob.month, formData.dob.day].join('-'),
      email: formData.email,
      password: formData.password,
    };
    const isValid = this.validateSignup(this.state);

    if (isValid) {
      this.setState({
        isWaitingServer: true,
      });

      return signupRequest(toSendData)
        .then((response) => {
          this.setState({
            isSignUpSuccessful: true,
          });
        })
        .catch((err) => {
          if (!err.response) {
            return this.setState({
              isConnectedToServer: false,
            });
          }

          if (err.response.status === 409) {
            this.setState({ userAlreadyExist: true });
          }
        })
        .finally(() => {
          this.setState({
            isWaitingServer: false,
          });
        });
    }

    this.setState({
      formData: {
        ...formData,
        name: formData.name ? formData.name : '',
        dob: {
          year: formData.dob.year ? formData.dob.year : '0',
          month: formData.dob.month ? formData.dob.month : '0',
          day: formData.dob.day ? formData.dob.day : '0',
        },
        email: formData.email ? formData.email : '',
        password: formData.password ? formData.password : '',
        confPassword: formData.confPassword ? formData.confPassword : '',
      },
    });
  };

  handleDateChange = (value, name) => {
    const { formData } = this.state;

    this.setState({
      formData: {
        ...formData,
        dob: {
          ...formData.dob,
          [name]: value,
        },
      },
    });
  };

  validateSignup = () => {
    const { name, dob, email, password } = this.state.formData;
    let isValid = true;
    let errors = { ...this.state.errors };

    if (!name) {
      errors.name = true;
      isValid = false;
    }

    if (dob.day === '0' || dob.month === '0' || dob.year === '0') {
      errors.dob = true;
      isValid = false;
    }

    if (!email) {
      errors.email = true;
      isValid = false;
    }

    if (!EMAIL_REGEXP.test(email)) {
      errors.emailFormat = true;
      isValid = false;
    }

    if (!password) {
      errors.password = true;
      isValid = false;
    }

    if (password.length > 0 && password.length < 6) {
      errors.passwordFormat = true;
      isValid = false;
    }

    if (!this.doPasswordsMatch()) {
      errors.confPassword = true;
      isValid = false;
    }

    this.setState({
      errors: {
        ...errors,
      },
    });

    return isValid;
  };

  doPasswordsMatch = () => {
    const { confPassword, password } = this.state.formData;

    if (confPassword === password) {
      return true;
    }

    return false;
  };

  render() {
    const {
      errors,
      formData,
      isWaitingServer,
      userAlreadyExist,
      isSignUpSuccessful,
      isConnectedToServer,
    } = this.state;

    if (isConnectedToServer) {
      if (!isSignUpSuccessful) {
        return (
          <Fragment>
            <Header isInsideUser={false} />
            <div className="form-wrapper">
              <h2>Sign Up</h2>
              <form
                className="signup-form"
                onSubmit={this.handleSubmit}
                autoComplete="off"
              >
                <div className="field-segment">
                  <Label className="field-title" htmlFor="name" value="Name" />
                  <TextField
                    className={errors.name ? ' empty' : ''}
                    name="name"
                    type="text"
                    placeHolder="Enter full name"
                    onChange={this.handleChange}
                    autoComplete="off"
                  />
                  {errors.name && (
                    <Label
                      className="error-label"
                      htmlFor=""
                      value="Please enter your name!"
                    />
                  )}
                </div>

                <div className="field-segment">
                  <Label
                    className="field-title"
                    htmlFor="dob"
                    value="Date of Birth"
                  />
                  <div className="date-wrapper">
                    <Dropdown
                      status={formData.dob.month === '0' ? ' wrong' : ''}
                      name="month"
                      options={MONTH_OPTIONS}
                      value={formData.dob.month}
                      onChange={this.handleDateChange}
                    />
                    <Dropdown
                      status={formData.dob.day === '0' ? ' wrong' : ''}
                      name="day"
                      options={DAY_OPTIONS}
                      value={formData.dob.day}
                      onChange={this.handleDateChange}
                    />
                    <Dropdown
                      status={formData.dob.year === '0' ? ' wrong' : ''}
                      name="year"
                      options={YEAR_OPTIONS}
                      value={formData.dob.year}
                      onChange={this.handleDateChange}
                    />
                  </div>
                  {errors.dob && (
                    <Label
                      className="error-label"
                      htmlFor=""
                      value="Please enter a valid date!"
                    />
                  )}
                </div>

                <div className="field-segment">
                  <Label
                    className="field-title"
                    htmlFor="email"
                    value="E-mail"
                  />
                  <TextField
                    className={
                      errors.email || errors.emailFormat || userAlreadyExist
                        ? ' empty'
                        : ''
                    }
                    name="email"
                    type="text"
                    placeHolder="New E-mail"
                    onChange={this.handleChange}
                    autoComplete="off"
                  />
                  {errors.email && !userAlreadyExist ? (
                    <Label
                      className="error-label"
                      htmlFor=""
                      value="E-mail cannot be empty!"
                    />
                  ) : (
                    ''
                  )}
                  {userAlreadyExist ? (
                    <Label
                      className="error-label"
                      htmlFor=""
                      value="User e-mail already exists!"
                    />
                  ) : (
                    ''
                  )}
                  {errors.emailFormat ? (
                    <Label
                      className="warning-label"
                      htmlFor=""
                      value="Incorrect e-mail format!"
                    />
                  ) : (
                    ''
                  )}
                </div>

                <div className="field-segment">
                  <Label
                    className="field-title"
                    htmlFor="password"
                    value="Password"
                  />
                  <TextField
                    className={
                      errors.password || errors.passwordFormat ? ' empty' : ''
                    }
                    name="password"
                    type="password"
                    placeHolder="New Password"
                    onChange={this.handleChange}
                    autoComplete="off"
                  />
                  {errors.password && !errors.passwordFormat && (
                    <Label
                      className="error-label"
                      htmlFor=""
                      value="Password cannot be empty!"
                    />
                  )}
                  {errors.passwordFormat && !errors.password && (
                    <Label
                      className="warning-label"
                      htmlFor=""
                      value="Atleast six characters"
                    />
                  )}
                </div>

                <div className="field-segment">
                  <Label
                    className="field-title"
                    htmlFor="confpassword"
                    value="Conform Password"
                  />
                  <TextField
                    className={
                      (errors.confPassword && ' empty') ||
                      (this.doPasswordsMatch()
                        ? ' pass-match'
                        : ' pass-not-match')
                    }
                    name="confPassword"
                    type="password"
                    placeHolder="Confirm Password"
                    onChange={this.handleChange}
                    autoComplete="off"
                  />
                  {errors.confPassword && (
                    <Label
                      className="error-label"
                      htmlFor=""
                      value="Passwords do not match!"
                    />
                  )}
                </div>

                <Button
                  className={isWaitingServer ? ' busy' : ''}
                  type="submit"
                  value={isWaitingServer ? 'Signing Up...' : 'Sign Up'}
                  isDisabled={isWaitingServer ? true : false}
                />
              </form>
              <p>
                Already have an account? Log In <Link to="/">here.</Link>
              </p>
            </div>
          </Fragment>
        );
      }

      return (
        <Fragment>
          <Header isInsideUser={false} />
          <div className="signup-success-wrapper">
            <h2>Account Registered!</h2>
            <p>
              Log In to your account <Link to="/">here.</Link>
            </p>
          </div>
        </Fragment>
      );
    }

    return <NoServerConnection />;
  }
}

export default Register;
