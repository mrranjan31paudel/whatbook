import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import Label from './Label';
import Button from './Button';
import Header from './Header';
import TextField from './TextField';
import loginRequest from './../services/login';
import tokenService from './../services/token';
import validateLogin from '../validators/login';
import NoServerConnection from './NoServerConnection';

import './../styles/loginsignup/form_wrapper.css';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      data: {
        email: null,
        password: null
      },
      isWaitingServer: false,
      isLoggedIn: false,
      emailExists: true,
      validPassword: true,
      isConnectedToServer: true
    };
  }

  componentDidMount() {
    if (tokenService.getAccessToken()) {
      return this.props.history.push('/user');
    }
  }

  handleSubmit = e => {
    e.preventDefault();

    const validFlag = validateLogin(this.state);

    if (validFlag) {
      this.setState({ isWaitingServer: true });

      loginRequest(this.state.data)
        .then(response => {
          tokenService.setTokens(
            response.data.accessToken,
            response.data.refreshToken
          );

          return this.props.history.push('/user');
        })
        .catch(err => {
          if (!err.response) {
            return this.setState({
              isConnectedToServer: false,
              isWaitingServer: false
            });
          }

          if (err.response.data.msg === 'USER_NOT_FOUND') {
            return this.setState({
              emailExists: false,
              validPassword: true,
              isWaitingServer: false
            });
          }

          if (err.response.data.msg === 'INVALID_PASSWORD') {
            return this.setState({
              emailExists: true,
              validPassword: false,
              isWaitingServer: false
            });
          }
        });
    }

    this.setState({
      data: {
        ...this.state.data,
        email: this.state.data.email ? this.state.data.email : '',
        password: this.state.data.password ? this.state.data.password : ''
      }
    });
  };

  handleChange = (targetField, value) => {
    this.setState({
      data: {
        ...this.state.data,
        [targetField]: value
      }
    });
  };

  render() {
    if (this.state.isConnectedToServer) {
      return (
        <Fragment>
          <Header isInsideUser={false} />
          <div className="form-wrapper">
            <h2>Log In</h2>
            <form
              className="login-form"
              onSubmit={this.handleSubmit}
              autoComplete="on">
              <div className="field-segment">
                <TextField
                  className={
                    this.state.data.email === '' || !this.state.emailExists
                      ? ' empty'
                      : ''
                  }
                  name="email"
                  type="text"
                  placeHolder="E-mail"
                  onChange={this.handleChange}
                  autoComplete="on" />
                {this.state.data.email === '' && this.state.emailExists ? (
                  <Label
                    className="error-label"
                    htmlFor=""
                    value="E-mail cannot be Empty!" />
                ) : ''}
                {!this.state.emailExists ? (
                  <Label
                    className="error-label"
                    htmlFor=""
                    value="User doesn't exist!" />
                ) : ''}
              </div>
              <div className="field-segment">
                <TextField
                  className={
                    this.state.data.password === '' || !this.state.validPassword
                      ? ' empty'
                      : ''
                  }
                  name="password"
                  type="password"
                  placeHolder="Password"
                  onChange={this.handleChange}
                  autoComplete="off" />
                {this.state.data.password === '' && this.state.validPassword ? (
                  <Label
                    className="error-label"
                    htmlFor=""
                    value="Password cannot be Empty!" />
                ) : ''}
                {!this.state.validPassword ? (
                  <Label
                    className="error-label"
                    htmlFor=""
                    value="Password doesn't match with user!" />
                ) : ''}
              </div>
              <Button
                className={this.state.isWaitingServer ? ' busy' : ''}
                type="submit"
                value={this.state.isWaitingServer ? 'Logging In...' : 'Log In'}
                isDisabled={this.state.isWaitingServer ? true : false} />
            </form>
            <p>
              Don't have an account? Sign Up <Link to="/signup">here.</Link>
            </p>
          </div>
        </Fragment>
      );
    }

    return <NoServerConnection />;
  }
}

export default Login;
