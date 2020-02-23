import React, { Fragment } from 'react';

import { getUserDetails, getRequestList, getNotificationsList, markNotificationAsRead } from './../services/user';
import tokenService from './../services/token';

import Header from './Header';

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
    }
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

  getListOfNotifications = () => { //called when user clicks notifications button
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
  }

  getNumberOfNewRequests = () => {
    getRequestList('/user/requests', {
      type: 'number'
    })
      .then(response => {
        console.log('RESPONSE: ', response);
        this.setState({
          numberOfUnansweredRequests: response.data.numberOfUnansweredRequests
        })
      })
      .catch(error => {
        console.log('Request List Error: ', error);
      });
  }

  handleNotificationClick = (e, id, target, targetid, postOwnerId, status) => {
    console.log('post ownerid: ', postOwnerId)
    if (status === 0) {
      markNotificationAsRead('/user/notifications', {
        notificationId: id
      })
        .then(response => {
          if (target === 'your post' || target === 'your comment') {
            return this.props.history.push(`/user/user_${postOwnerId}/post/post_${targetid}`);
          }
          else if (target === 'you friend request' || target === 'your friend request') {
            return this.props.history.push(`/user/user_${targetid}`);
          }
        })
        .catch(err => {
          console.log('notification read error: ', err);
        });
    }
    else {
      if (target === 'your post' || target === 'your comment') {
        return this.props.history.push(`/user/user_${postOwnerId}/post/post_${targetid}`);
      }
      else if (target === 'you friend request' || target === 'your friend request') {
        return this.props.history.push(`/user/user_${targetid}`);
      }
    }

  }

  handleProfileClick = () => {
    return this.props.history.push(`/user/user_${this.state.userData.id}`);
  }

  handleHomeClick = () => {
    return this.props.history.push('/user');
    // window.location.reload();
  }

  handleProfileNameClick = (ownerId) => {
    return this.props.history.push(`/user/user_${ownerId}`);
    // window.location.reload();
  }

  getUnreadNotifications = () => {
    return this.state.notificationList.filter(element => element.status === 0);
  }

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
        />

        <div className="notification-list-container">
          <h3>
            Notifications
          </h3>
          <hr />
          {
            this.state.notificationList.length > 0 ?
              <ul className="notification-list-wrapper">
                {
                  this.state.notificationList.map((data, index) =>
                    <li key={data.id} >
                      <div className={data.status === 0 ? 'notification-container' : 'notification-container read-notification'} onClick={(e) => this.handleNotificationClick(e, data.id, data.target, data.targetid, data.post_ownerid, data.status)}>
                        <p>
                          <span className="issuer-name">{data.name}</span> {data.action} {data.target}.
                    </p>
                        <span className="notification-date-time">{data.date} at {data.time}</span>
                      </div>
                    </li>
                  )
                }
              </ul> :
              <span className="empty-notification-list-msg">No notifications.</span>
          }
        </div>
      </Fragment>
    );
  }
}

export default Notifications;