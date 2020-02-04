import React from 'react';
import { Link } from 'react-router-dom';
import {http} from './../configs/lib.imports';

import './../styles/common/Header.css';

class Header extends React.Component {
  logOutFunction = () => {
    http.post('/logout', {
        refreshToken: localStorage.getItem('myRefreshToken')
    })
    .then(response => {
      console.log('logout response: ', response);
    })
    .catch(err => {
      console.log('logout err: ', err);
    });
    localStorage.removeItem('myAccessToken');
    localStorage.removeItem('myRefreshToken');
  }

  render() {
    if(this.props.isInsideUser){
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
    else{
      return (
        <header className="header-seg">
          <div className="not-in-user"></div>
        </header>
      );
    }
  }
}

export default Header;