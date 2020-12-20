import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { localhost } from './../constants/config';

import './../styles/common/Header.css';

class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      searchText: '',
      searchResult: [],
      isFocusOnSearchBar: false
    };
  }

  handleSearchBarFocusIn = () => {
    this.setState({
      isFocusOnSearchBar: true
    });
  };

  handleSearchBarFocusOut = () => {
    this.setState({
      isFocusOnSearchBar: false
    });
  };

  handleSearchTextChange = e => {
    //send request to get search word list
    if (e.target.value) {
      this.props
        .searchPeople(e.target.value)
        .then(response => {
          console.log('search list: ', response);
          this.setState({
            searchResult: response
          });
        })
        .catch(err => console.log('ERROR: ', err));
    } else {
      this.setState({
        searchResult: []
      });
    }

    this.setState({
      searchText: e.target.value
    });
  };

  handleSearchSubmit = e => {
    e.preventDefault();
  };

  render() {
    if (this.props.isInsideUser) {
      return (
        <Fragment>
          <header className="header-seg">
            <nav>
              <div className="header-logo-search-bar-container">
                <div className="header-logo-container">
                  <Link className="header-logo-link" to="/user">
                    <span
                      className="header-logo-image"
                      style={{
                        backgroundImage: `url(http://${localhost}:3000/whatbooklogo.png)`
                      }}
                    ></span>
                  </Link>
                </div>
                <form
                  className="search-bar-container"
                  onSubmit={this.handleSearchSubmit}
                >
                  <input
                    className="search-bar"
                    type="text"
                    placeholder="Search People..."
                    onChange={this.handleSearchTextChange}
                    onFocus={this.handleSearchBarFocusIn}
                    onBlur={this.handleSearchBarFocusOut}
                    value={this.state.searchText}
                  ></input>
                  <button
                    className={
                      this.state.isFocusOnSearchBar
                        ? 'search-img-container focus-on-search-bar'
                        : 'search-img-container'
                    }
                    type="submit"
                  >
                    <img
                      className="search-img"
                      src={`http://${localhost}:3000/search-solid.svg`}
                      alt="searchSVG"
                    ></img>
                  </button>
                  {this.state.searchResult.length > 0 ? (
                    <div className="search-result-list-modal">
                      <ul className="search-result-list">
                        {this.state.searchResult.map((value, index) => (
                          <li key={`${index}` + value}>{value}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    ''
                  )}
                </form>
              </div>
              <ul className="navigation-links">
                <li>
                  <div>
                    <Link
                      onClick={this.props.onProfileClick}
                      to={`/user/user_${this.props.userId}`}
                    >
                      <span>{this.props.profileName}</span>{' '}
                      <img
                        className="nav-img"
                        src={`http://${localhost}:3000/user-solid.svg`}
                        alt="profileSVG"
                      ></img>
                    </Link>
                  </div>
                </li>

                <li>
                  <div>
                    <Link onClick={this.props.onHomeClick} to="/user">
                      <img
                        className="nav-img"
                        src={`http://${localhost}:3000/home-solid.svg`}
                        alt="homeSVG"
                      ></img>
                    </Link>
                  </div>
                </li>

                <li>
                  <div>
                    <Link
                      onClick={this.props.onNotificationsClick}
                      to="/notifications"
                    >
                      <img
                        className="nav-img"
                        src={`http://${localhost}:3000/bell-solid.svg`}
                        alt="notificationSVG"
                      ></img>
                    </Link>
                  </div>
                  {this.props.numberOfUnreadNotifications > 0 ? (
                    <span className="red-dot-notification">
                      {this.props.numberOfUnreadNotifications}
                    </span>
                  ) : (
                    ''
                  )}
                </li>

                <li>
                  <div>
                    <Link to="/people">
                      <img
                        className="nav-img"
                        src={`http://${localhost}:3000/user-friends-solid.svg`}
                        alt="friendsSVG"
                      ></img>
                    </Link>
                  </div>
                  {this.props.numberOfUnansweredRequests > 0 ? (
                    <span className="red-dot-notification">
                      {this.props.numberOfUnansweredRequests}
                    </span>
                  ) : (
                    ''
                  )}
                </li>

                <li>
                  <div>
                    <Link onClick={this.props.onLogOutClick} to="/">
                      <img
                        className="nav-img"
                        src={`http://${localhost}:3000/sign-out-alt-solid.svg`}
                        alt="logoutSVG"
                      ></img>
                    </Link>
                  </div>
                </li>
              </ul>
            </nav>
          </header>
        </Fragment>
      );
    } else {
      return (
        <header className="header-seg">
          <div className="not-in-user"></div>
        </header>
      );
    }
  }
}

export default Header;
