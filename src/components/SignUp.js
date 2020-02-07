import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { EMAIL_REGEXP } from './../constants/config';
import signupRequest from '../services/signup';
import Header from './Header';
import Label from './sub-components/Label';
import TextField from './sub-components/TextField';
import Button from './sub-components/Button';
import Dropdown from './sub-components/Dropdown';
import { MONTH, DAY, Year } from '../constants/dob';
import validateSignup from '../validators/signup';

import './../styles/loginsignup/formWrapper.css';
import './../styles/loginsignup/signupSuccessWrapper.css';


class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      data: {
        name: null,
        dob: {
          year: null,
          month: null,
          day: null
        },
        email: null,
        password: null,
        confPassword: null
      },
      isWaitingServer: false,
      isSignUpSuccessful: false
    };
  }

  handleChange = (targetField, value) => {
    this.setState({
      data: {
        ...this.state.data, [targetField]: value
      }
    });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const toSendData = {
      name: this.state.data.name,
      dob: `${this.state.data.dob.year}-${this.state.data.dob.month}-${this.state.data.dob.day}`,
      email: this.state.data.email,
      password: this.state.data.password
    }
    const validFlag = validateSignup(this.state);

    if (validFlag && !this.isMailInvalid()) {
      signupRequest(toSendData)
        .then((response) => {
          console.log('RESPONSE: ', response);
          this.setState({
            isWaitingServer: false,
            isSignUpSuccessful: true
          });
        })
        .catch((err) => {
          console.log('ERROR: ', err.response);
          this.setState({
            isWaitingServer: false
          });
        });
      this.setState({
        isWaitingServer: true
      });
    }
    else {
      this.setState({
        data: {
          ...this.state.data,
          name: !this.state.data.name ? '' : this.state.data.name,
          dob: {
            year: !this.state.data.dob.year ? '0' : this.state.data.dob.year,
            month: !this.state.data.dob.month ? '0' : this.state.data.dob.month,
            day: !this.state.data.dob.day ? '0' : this.state.data.dob.day
          },
          email: !this.state.data.email ? '' : this.state.data.email,
          password: !this.state.data.password ? '' : this.state.data.password,
          confPassword: !this.state.data.confPassword ? '' : this.state.data.confPassword
        }
      });
    }
  }

  handleDateChange = (value, name) => {
    this.setState({
      data: {
        ...this.state.data,
        dob: {
          ...this.state.data.dob,
          [name]: value
        }
      }
    });
  }

  isDateInvalid = () => {
    if (this.state.data.dob.day === '0' || this.state.data.dob.month === '0' || this.state.data.dob.year === '0') {
      return true;
    }
    return false;
  }

  isMailInvalid = () => {
    if (this.state.data.email && this.state.data.email.length > 0 && !EMAIL_REGEXP.test(this.state.data.email)) {
      return true;
    }
    return false;
  }

  isPasswordInvalid = () => {
    if (this.state.data.password && this.state.data.password.length > 0 && this.state.data.password.length < 6) {
      return true;
    }
    return false;
  }

  doPasswordsMatch = () => {

    if (this.state.data.confPassword === this.state.data.password) {
      return true;
    }
    return false;
  }

  render() {
    if (!this.state.isSignUpSuccessful) {
      return (
        <Fragment>
          <Header isInsideUser={false} />
          <div className="form-wrapper">
            <h2>Log In</h2>
            <form className="login-form" onSubmit={this.handleSubmit} autoComplete="on">
              <div className="field-segment">
                <TextField className={this.state.data.email === '' ? ' empty' : ''} name="email" type="text" placeHolder="E-mail" onChange={this.handleChange} autoComplete="on" />
                <Label className="error-label" htmlFor="" value={this.state.data.email === '' ? 'E-mail cannot be Empty!' : ''} />
              </div>
              <div className="field-segment">
                <TextField className={this.state.data.password === '' ? ' empty' : ''} name="password" type="password" placeHolder="Password" onChange={this.handleChange} autoComplete="off" />
                <Label className="error-label" htmlFor="" value={this.state.data.password === '' ? 'Password cannot be Empty!' : ''} />
              </div>
              <Button className={this.state.isWaitingServer ? ' busy' : ''} type="submit" value={this.state.isWaitingServer ? 'Logging In...' : 'Log In'} isDisabled={this.state.isWaitingServer ? true : false} />

            </form>
            <p>
              Don't have an account? Sign Up <Link to="/signup">here.</Link>
            </p>
          </div>
          <div className="form-wrapper">
            <h2>Sign Up</h2>
            <form className="signup-form" onSubmit={this.handleSubmit} autoComplete="off">
              <div className="field-segment">
                <Label className="field-title" htmlFor="name" value="Name: " />
                <TextField className={this.state.data.name === '' ? ' empty' : ''} name="name" type="text" placeHolder="Enter full name" onChange={this.handleChange} autoComplete="off" />
                <Label className="error-label" htmlFor="" value={this.state.data.name === '' ? 'Please enter your name!' : ''} />
              </div>

              <div className="field-segment">
                <Label className="field-title" htmlFor="dob" value="Date of Birth: " />
                <div className="date-wrapper">
                  <Dropdown status={this.state.data.dob.month === '0' ? ' wrong' : ''} className="month" items={MONTH} onChange={this.handleDateChange} />
                  <Dropdown status={this.state.data.dob.day === '0' ? ' wrong' : ''} className="day" items={DAY} onChange={this.handleDateChange} />
                  <Dropdown status={this.state.data.dob.year === '0' ? ' wrong' : ''} className="year" items={Year} onChange={this.handleDateChange} />
                </div>
                <Label className="error-label" htmlFor="" value={this.isDateInvalid() ? 'Please enter a valid date!' : ''} />
              </div>

              <div className="field-segment">
                <Label className="field-title" htmlFor="email" value="E-mail: " />
                <TextField className={this.state.data.email === '' ? ' empty' : ''} name="email" type="text" placeHolder="New E-mail" onChange={this.handleChange} autoComplete="off" />
                <Label className="error-label" htmlFor="" value={this.state.data.email === '' ? 'E-mail cannot be empty!' : ''} />
                <Label className="warning-label" htmlFor="" value={this.isMailInvalid() ? 'Incorrect e-mail format!' : ''} />
              </div>

              <div className="field-segment">
                <Label className="field-title" htmlFor="password" value="Password:" />
                <TextField className={this.state.data.password === '' ? ' empty' : ''} name="password" type="password" placeHolder="New Password" onChange={this.handleChange} autoComplete="off" />
                <Label className="error-label" htmlFor="" value={this.state.data.password === '' ? 'Password cannot be empty!' : ''} />
                <Label className="warning-label" htmlFor="" value={this.isPasswordInvalid() ? 'Atleast six characters!' : ''} />
              </div>

              <div className="field-segment">
                <Label className="field-title" htmlFor="confpassword" value="Conform Password:" />
                <TextField className={(this.state.data.confPassword === '' ? ' empty' : '') || (this.doPasswordsMatch() ? ' pass-match' : ' pass-not-match')} name="confPassword" type="password" placeHolder="Confirm Password" onChange={this.handleChange} autoComplete="off" />
                <Label className="error-label" htmlFor="" value={this.state.data.confPassword === '' ? 'Password cannot be empty!' : ''} />
              </div>

              <Button className={this.state.isWaitingServer ? ' busy' : ''} type="submit" value={this.state.isWaitingServer ? 'Signing Up...' : 'Sign Up'} isDisabled={this.state.isWaitingServer ? true : false} />

            </form>
            <p>
              Already have an account? Log In <Link to="/">here.</Link>
            </p>
          </div>
        </Fragment>

      );
    }
    else {
      return (
        <Fragment>
          <Header isInsideUser={false} />
          <div className="signup-success-wrapper">
            <h2>
              Account Registered!
            </h2>
            <p>
              Log In to your account <Link to="/" >here.</Link>
            </p>
          </div>
        </Fragment>
      );
    }
  }
}

export default Register;