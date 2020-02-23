import React from 'react';
import { Link } from 'react-router-dom';

import { localhost } from './../constants/config';

import './../styles/common/Header.css';

class Header extends React.Component {

  render() {

    if (this.props.isInsideUser) {
      return (
        <header className="header-seg">
          <nav>
            <div className="search-bar-container">
              <input className="search-bar" type="text" placeholder="Search People..."></input>
              <img className="search-img" src={`http://${localhost}:3000/search-solid.svg`} alt="searchSVG"></img>
            </div>
            <ul >
              <li>
                <div>
                  <Link onClick={this.props.onProfileClick} to={`/user/user_${this.props.userId}`} >
                    {this.props.profileName} <img className="nav-img" src={`http://${localhost}:3000/user-solid.svg`} alt="profileSVG"></img>
                  </Link>
                </div>
              </li>

              <li>
                <div>
                  <Link onClick={this.props.onHomeClick} to="/user">
                    <img className="nav-img" src={`http://${localhost}:3000/home-solid.svg`} alt="homeSVG"></img>
                  </Link>
                </div>
              </li>

              <li>
                <div>
                  <Link onClick={this.props.onNotificationsClick} to="/notifications">
                    <img className="nav-img" src={`http://${localhost}:3000/bell-solid.svg`} alt="notificationSVG"></img>
                  </Link>
                </div>
                {
                  this.props.numberOfUnreadNotifications > 0 ?
                    <span className="red-dot-notification">
                      {this.props.numberOfUnreadNotifications}
                    </span> :
                    ''
                }
              </li>

              <li>
                <div>
                  <Link to="/people">
                    <img className="nav-img" src={`http://${localhost}:3000/user-friends-solid.svg`} alt="friendsSVG"></img>
                  </Link>
                </div>
                {
                  this.props.numberOfUnansweredRequests > 0 ?
                    <span className="red-dot-notification">
                      {this.props.numberOfUnansweredRequests}
                    </span> :
                    ''
                }
              </li>

              <li>
                <div>
                  <Link onClick={this.props.onLogOutClick} to="/">
                    <img className="nav-img" src={`http://${localhost}:3000/sign-out-alt-solid.svg`} alt="logoutSVG"></img>
                  </Link>
                </div>
              </li>

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