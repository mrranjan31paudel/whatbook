import React from 'react';
import { Link } from 'react-router-dom';

import tokenService from './../services/token';
import { logoutUser } from './../services/user';

import './../styles/common/Header.css';

class Header extends React.Component {
  logOutFunction = () => {
    logoutUser('/logout', {
      refreshToken: tokenService.getRefreshToken()
    })
      .then(() => {
        tokenService.removeTokens();
        this.props.history.push('/');
      })
      .catch(err => {
        console.log('logout err: ', err);
      });

  }

  render() {
    if (this.props.isInsideUser) {
      return (
        <header className="header-seg">
          <nav>
            <ul >
              <li><Link to="/">{this.props.profileName}</Link></li>
              <li><Link to="/">Home</Link></li>
              <li><Link onClick={this.logOutFunction} to="/">Log Out</Link></li>
              <li>Search</li>
            </ul>
          </nav>
        </header>
      );
    }
    else {
      return (
        <header className="header-seg">
          <div className="not-in-user"></div>
        </header>
      );
    }
  }
}

export default Header;