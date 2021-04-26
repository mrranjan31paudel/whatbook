import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import './../styles/common/header.css';

class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      searchText: '',
      searchResult: [],
      isFocusOnSearchBar: false,
    };
  }

  handleSearchBarFocusIn = () => {
    this.setState({ isFocusOnSearchBar: true });
  };

  handleSearchBarFocusOut = () => {
    this.setState({ isFocusOnSearchBar: false });
  };

  handleSearchTextChange = (e) => {
    //send request to get search word list
    this.setState({ searchText: e.target.value });

    if (e.target.value) {
      return this.props
        .searchPeople(e.target.value)
        .then((response) => {
          this.setState({ searchResult: response });
        })
        .catch((err) => console.log('ERROR: ', err));
    } else {
      this.setState({ searchResult: [] });
    }
  };

  handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  render() {
    if (!this.props.isInsideUser) {
      return (
        <header className="header-seg">
          <nav>
            <div className="header-logo-container">
              <img
                className="header-logo-image"
                src="/whatbooklogo.png"
                alt="whatbooklogo"
              />
            </div>
          </nav>
        </header>
      );
    }

    return (
      <Fragment>
        <header className="header-seg">
          <nav>
            <div className="header-logo-search-bar-container">
              <div className="header-logo-container">
                <Link className="header-logo-link" to="/user">
                  <img
                    className="header-logo-image"
                    src="/whatbooklogo.png"
                    alt="whatbooklogo"
                  />
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
                />
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
                    src="search-solid.svg"
                    alt="searchSVG"
                  />
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
                    <span>{this.props.profileName}</span>&ensp;
                    <img
                      className="nav-img"
                      src="user-solid.svg"
                      alt="profileSVG"
                    />
                  </Link>
                </div>
              </li>

              <li>
                <div>
                  <Link onClick={this.props.onHomeClick} to="/user">
                    <img
                      className="nav-img"
                      src="home-solid.svg"
                      alt="homeSVG"
                    />
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
                      src="bell-solid.svg"
                      alt="notificationSVG"
                    />
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
                      src="user-friends-solid.svg"
                      alt="friendsSVG"
                    />
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
                      src="sign-out-alt-solid.svg"
                      alt="logoutSVG"
                    />
                  </Link>
                </div>
              </li>
            </ul>
          </nav>
        </header>
      </Fragment>
    );
  }
}

export default Header;
