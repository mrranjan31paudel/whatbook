import React from 'react';
import { Link } from 'react-router-dom';
import './../styles/common/Header.css';

class Header extends React.Component {
  logOutFunction = () => {
    localStorage.removeItem('myAccessToken');
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