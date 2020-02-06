import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import loginRequest from './../services/login';
import tokenService from './../services/token';
import Header from './Header';
import TextField from './sub-components/TextField';
import Label from './sub-components/Label';
import Button from './sub-components/Button';
import validateLogin from '../validators/login';

import './../styles/loginsignup/formWrapper.css';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      data: {
        email: null,
        password: null
      },
      isWaitingServer: false,
      isLoggedIn: false
    };
  }

  componentDidMount() {
    if (tokenService.getAccessToken()) {
      return this.props.history.push('/user');
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const validFlag = validateLogin(this.state);
    if (validFlag) {
      loginRequest(this.state.data)
        .then((response) => {
          tokenService.setTokens(response.data.accessToken, response.data.refreshToken);
          return this.props.history.push('/user');
        })
        .catch((err) => {
          console.log('ERROR:', err.response);
          this.setState({
            isWaitingServer: false
          });
        });
      this.setState({
        isWaitingServer: true
      });
    }
    else {
      console.log('submit blocked');
      this.setState({
        data: {
          ...this.state.data,
          email: this.state.data.email === null ? '' : this.state.data.email,
          password: this.state.data.password === null ? '' : this.state.data.password
        }
      });
    }

  }

  handleChange = (targetField, value) => {
    this.setState({
      data: {
        ...this.state.data, [targetField]: value
      }
    });
  }

  render() {
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
      </Fragment>
    );
  }
}

export default Login;