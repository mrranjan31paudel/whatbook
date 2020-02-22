import React, { Fragment } from 'react';

import { getUserDetails, getPeopleList, getFriendList, getRequestList, logoutUser, sendRequest, acceptRequest, deleteRequest } from './../services/user';
import tokenService from './../services/token';

import Header from './Header';
import UserHolder from './sub-components/UserHolder';

import './../styles/people/people.css';

class People extends React.Component {

  constructor() {
    super();
    this.state = {
      friendList: [],
      peopleList: [],
      requestList: {
        sentList: [],
        recievedList: []
      },
      userData: {
        id: '',
        name: '',
        dob: '',
        email: ''
      },

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
          //this.getPeopleList();
          this.getListOfFriends();
          this.getListOfRequests();
          this.getListOfPeople();
        }
      })
      .catch((err) => {
        console.log('Component mount error: ', err.response)
        if (!err.response) {
          this.setState({
            isConnectedToServer: false
          })
        }
        else if (err.response && err.response.status === 401) {
          tokenService.removeTokens();
          return this.props.history.push('/');
        }
      });
  }

  getListOfPeople = () => {
    getPeopleList('/user/people', {
      userId: this.state.userData.id
    })
      .then(response => {
        console.log('RESPONSE: ', response);
        console.log(response);
        this.setState({
          peopleList: response.data
        })
      })
      .catch(error => {
        console.log('People List: ', error);
      });
  }

  getListOfFriends = () => {
    getFriendList('/user/friend', {
      userId: this.state.userData.id
    })
      .then(response => {
        console.log('RESPONSE: ', response);
        this.setState({
          friendList: response.data
        })
      })
      .catch(error => {
        console.log('Friend List Error: ', error);
      });
  }

  getListOfRequests = () => {
    getRequestList('/user/requests', {
      type: 'list'
    })
      .then(response => {
        console.log('RESPONSE: ', response);
        this.setState({
          requestList: response.data
        })
      })
      .catch(error => {
        console.log('Request List Error: ', error);
      });
  }

  handleLogOut = () => {
    logoutUser('/logout', {
      refreshToken: tokenService.getRefreshToken()
    })
      .then(() => {
        tokenService.removeTokens();
        this.props.history.push('/');
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleAddFriendClick = (e) => {
    console.log('clicked button ID: ', e.target.id);
    sendRequest('/user/friend', {
      recieverId: e.target.id.split('-')[1]
    })
      .then(response => {
        this.getListOfFriends();
        this.getListOfRequests();
        this.getListOfPeople();
      })
      .catch(error => {
        console.log(error);
      })
  }

  handleAcceptRequestClick = (e) => {//sends PUT request
    console.log('clicked button ID: ', e.target.id);
    acceptRequest('/user/friend', {
      senderId: e.target.id.split('-')[1]
    })
      .then(response => {
        this.getListOfFriends();
        this.getListOfRequests();
        this.getListOfPeople();
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleDeleteRequestClick = (e) => {
    console.log('clicked button ID: ', e.target.id);
    deleteRequest('/user/friend', {
      friendId: e.target.id.split('-')[1]
    })
      .then(response => {
        this.getListOfFriends();
        this.getListOfRequests();
        this.getListOfPeople();
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleProfileClick = () => {
    return this.props.history.push(`/user/user_${this.state.userData.id}`);
  }

  handleHomeClick = () => {
    this.props.history.push('/user');
    // window.location.reload();
  }

  render() {
    return (
      <Fragment>
        <Header
          userId={this.state.userData.id}
          profileName={this.state.userData.name}
          numberOfUnansweredRequests={this.state.requestList.recievedList.length}
          isInsideUser={true} {...this.props}
          onLogOutClick={this.handleLogOut}
          onProfileClick={this.handleProfileClick}
          onHomeClick={this.handleHomeClick}
        />

        <div className="people-container">
          <div className="friend-list-container">
            <h3>
              Friends ({this.state.friendList.length})
            </h3>
            <ul className="friend-list-wrapper">
              {
                this.state.friendList.map((data, index) =>
                  <li key={index}>
                    <UserHolder userData={data} />
                  </li>
                )
              }
            </ul>
          </div>

          <div className="people-n-request-list-container">
            <div className="request-list-container">
              <h3>
                Friend Requests
              </h3>

              <div className="sent-list-wrapper">
                <span className="request-type-text">Sent</span>
                {
                  this.state.requestList.sentList.length > 0 ?
                    <ul className="sent-list">
                      {
                        this.state.requestList.sentList.map((data, index) =>
                          <li key={index}>
                            <Fragment>
                              <UserHolder userData={data} />
                              <button id={`cancel-${data.id}`} onClick={this.handleDeleteRequestClick}>Cancel Request</button>
                            </Fragment>
                          </li>
                        )
                      }
                    </ul> :
                    <Fragment>
                      <br></br><span className="empty-request-list-text">No Requests Sent.</span>
                    </Fragment>

                }
              </div>
              <hr />
              <div className="recieved-list-wrapper">
                <span className="request-type-text">Recieved</span>
                {
                  this.state.requestList.recievedList.length > 0 ?
                    <ul className="recieved-list">
                      {
                        this.state.requestList.recievedList.map((data, index) =>
                          <li key={index}>
                            <Fragment>
                              <UserHolder userData={data} />
                              <button id={`accept-${data.id}`} onClick={this.handleAcceptRequestClick}>Accept</button>
                              <button id={`delete-${data.id}`} onClick={this.handleDeleteRequestClick}>Delete</button>
                            </Fragment>
                          </li>
                        )
                      }
                    </ul> :
                    <Fragment>
                      <br></br><span className="empty-request-list-text">No Requests Recieved.</span>
                    </Fragment>
                }
              </div>

            </div>

            <div className="people-list-container">
              <h3>
                People
              </h3>
              <ul className="people-list-wrapper">
                {
                  this.state.peopleList.map((data, index) =>
                    <li key={index}>
                      <UserHolder userData={data} />
                      <button id={`add-${data.id}`} onClick={this.handleAddFriendClick}>Add Friend +</button>
                    </li>
                  )
                }
              </ul>
            </div>
          </div>
        </div>
      </Fragment >
    );
  }
}

export default People;
