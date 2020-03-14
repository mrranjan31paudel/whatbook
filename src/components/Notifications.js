import React, { Fragment } from 'react';

import {
  getUserDetails,
  getRequestList,
  getNotificationsList,
  markNotificationAsRead,
  deleteNotification,
  getPeopleList
} from './../services/user';
import tokenService from './../services/token';
import { localhost } from './../constants/config';

import Header from './Header';
import ToolTip from './ToolTip';

import './../styles/user/notifications.css';

class Notifications extends React.Component {
  constructor() {
    super();

    this.state = {
      userData: {
        id: '',
        name: '',
        dob: '',
        email: ''
      },
      notificationList: [],
      numberOfUnansweredRequests: 0
    };
  }

  componentDidMount() {
    getUserDetails('/user')
      .then(response => {
        if (response) {
          this.setState({
            userData: {
              id: response.data.id,
              name: response.data.name,
              dob: response.data.dob,
              email: response.data.email
            }
          });
          this.getNumberOfNewRequests();
          this.getListOfNotifications();
        }
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          tokenService.removeTokens();
          return this.props.history.push('/');
        }
      });
  }

  getListOfNotifications = () => {
    //called when user clicks notifications button
    getNotificationsList('/user/notifications', {
      type: 'list'
    })
      .then(response => {
        console.log('notifications response: ', response);
        this.setState({
          notificationList: response.data
        });
      })
      .catch(err => {
        console.log('Notification number error: ', err);
        if (err.response && err.response.status === 401) {
          tokenService.removeTokens();
          return this.props.history.push('/');
        }
      });
  };

  getNumberOfNewRequests = () => {
    getRequestList('/user/requests', {
      type: 'number'
    })
      .then(response => {
        console.log('RESPONSE: ', response);
        this.setState({
          numberOfUnansweredRequests: response.data.numberOfUnansweredRequests
        });
      })
      .catch(error => {
        console.log('Request List Error: ', error);
      });
  };

  handleNotificationClick = (e, id, target, targetid, postOwnerId, status) => {
    console.log('post ownerid: ', postOwnerId);
    if (status === 0) {
      markNotificationAsRead('/user/notifications', {
        notificationId: id
      })
        .then(response => {
          if (target === 'your post' || target === 'your comment') {
            return this.props.history.push(
              `/user/user_${postOwnerId}/post/post_${targetid}`
            );
          } else if (
            target === 'you friend request' ||
            target === 'your friend request'
          ) {
            return this.props.history.push(`/user/user_${targetid}`);
          }
        })
        .catch(err => {
          console.log('notification read error: ', err);
        });
    } else {
      if (target === 'your post' || target === 'your comment') {
        return this.props.history.push(
          `/user/user_${postOwnerId}/post/post_${targetid}`
        );
      } else if (
        target === 'you friend request' ||
        target === 'your friend request'
      ) {
        return this.props.history.push(`/user/user_${targetid}`);
      }
    }
  };

  handleMarkAsReadClick = e => {
    e.preventDefault();

    markNotificationAsRead('/user/notifications', {
      notificationId: 'all'
    })
      .then(response => {
        this.getListOfNotifications();
      })
      .catch(err => {
        console.log('mark notification as read err: ', err);
      });
  };

  handleNotificationReadClick = (e, id, status) => {
    e.preventDefault();

    markNotificationAsRead('/user/notifications', {
      notificationId: id,
      toMakeStatus: status === 0 ? 1 : 0
    })
      .then(response => {
        this.getListOfNotifications();
      })
      .catch(err => {
        console.log('mark notification as read/unread err: ', err);
      });
  };

  handleDeleteNotificationClick = (e, id) => {
    e.preventDefault();

    deleteNotification('/user/notifications', {
      notificationId: id
    })
      .then(response => {
        this.getListOfNotifications();
      })
      .catch(err => {
        console.log('delete notification err: ', err);
      });
  };

  searchPeople = searchText => {
    return new Promise((resolve, reject) => {
      getPeopleList('/user/people', {
        userId: this.state.userData.id,
        searchText: searchText
      })
        .then(response => {
          resolve(response.data);
        })
        .catch(err => console.log('Sear result ERROR: ', err));
    });
  };

  handleProfileClick = () => {
    return this.props.history.push(`/user/user_${this.state.userData.id}`);
  };

  handleHomeClick = () => {
    return this.props.history.push('/user');
    // window.location.reload();
  };

  handleProfileNameClick = ownerId => {
    return this.props.history.push(`/user/user_${ownerId}`);
    // window.location.reload();
  };

  getUnreadNotifications = () => {
    return this.state.notificationList.filter(element => element.status === 0);
  };

  render() {
    return (
      <Fragment>
        <Header
          userId={this.state.userData.id}
          profileName={this.state.userData.name}
          numberOfUnansweredRequests={this.state.numberOfUnansweredRequests}
          numberOfUnreadNotifications={this.getUnreadNotifications().length}
          isInsideUser={true}
          {...this.props}
          onLogOutClick={this.handleLogOut}
          onProfileClick={this.handleProfileClick}
          onHomeClick={this.handleHomeClick}
          searchPeople={this.searchPeople}
        />

        <div className="notification-list-container">
          <h3>Notifications</h3>
          <hr />
          {this.state.notificationList.length > 0 ? (
            <Fragment>
              <a
                className="mark-as-read"
                href="/#"
                onClick={this.handleMarkAsReadClick}
              >
                Mark all as read
              </a>
              <ul className="notification-list-wrapper">
                {this.state.notificationList.map((data, index) => (
                  <li
                    key={data.id}
                    className={
                      data.status === 0
                        ? 'unread-notification'
                        : 'read-notification'
                    }
                  >
                    <div
                      className="notification-container"
                      onClick={e =>
                        this.handleNotificationClick(
                          e,
                          data.id,
                          data.target,
                          data.targetid,
                          data.post_ownerid,
                          data.status
                        )
                      }
                    >
                      <p>
                        <span className="issuer-name">{data.name}</span>{' '}
                        {data.action} {data.target}.
                      </p>
                      <span className="notification-date-time">
                        {data.date} at {data.time}
                      </span>
                    </div>

                    <div className="notification-button-container">
                      <button
                        id={`notification-delete-button-${data.id}`}
                        className="notification-action-button"
                        style={{
                          backgroundImage: `url(http://${localhost}:3000/trash-alt-solid.svg)`
                        }}
                        onClick={e =>
                          this.handleDeleteNotificationClick(e, data.id)
                        }
                      >
                        <ToolTip
                          toolTipText={'Delete'}
                          positionTop="0"
                          positionLeft="100"
                        />
                      </button>

                      <button
                        id={`notification-read-button-${data.id}`}
                        className="notification-action-button"
                        style={{
                          backgroundImage: `url(http://${localhost}:3000/dot-circle-regular.svg)`
                        }}
                        onClick={e =>
                          this.handleNotificationReadClick(
                            e,
                            data.id,
                            data.status
                          )
                        }
                      >
                        <ToolTip
                          toolTipText={
                            data.status === 0
                              ? 'Mark as read'
                              : 'Mark as unread'
                          }
                          positionTop={0}
                          positionLeft={100}
                        />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </Fragment>
          ) : (
            <span className="empty-notification-list-msg">
              No notifications.
            </span>
          )}
        </div>
      </Fragment>
    );
  }
}

export default Notifications;
