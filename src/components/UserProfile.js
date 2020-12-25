import React, { Fragment } from 'react';

import {
  logoutUser,
  postComment,
  sendRequest,
  getComments,
  updateContent,
  deleteContent,
  acceptRequest,
  deleteRequest,
  getPeopleList,
  getUserDetails,
  getUserStories,
  getRequestList,
  changeUserData,
  getNotificationsList
} from './../services/user';
import Header from './Header';
import tokenService from './../services/token';
import ProfileEditPopUp from './ProfileEditPopUp';
import UserStoryContainer from './UserStoryContainer';
import NoServerConnection from './NoServerConnection';

import './../styles/user/user_profile.css';

class UserProfile extends React.Component {
  constructor() {
    super();
    this.state = {
      userData: {
        id: '',
        name: '',
        dob: '',
        email: ''
      },
      profileData: {
        id: '',
        name: '',
        dob: '',
        email: '',
        isOwner: '',
        isFriend: '',
        isRequestSent: ''
      },

      userPosts: [],
      userNotifications: [],
      numberOfUnreadNotifications: 0,
      numberOfUnansweredRequests: 0,
      isConnectedToServer: true,
      isLoading: false,
      isOptionClicked: false,
      isEditProfileClicked: false,
      selectedCommentId: null,
      selectedPostId: null
    };
  }

  componentDidMount() {
    this.loadProfilePage();
  }

  loadProfilePage = () => {
    this.setState({
      isLoading: true
    });

    getUserDetails('/user')
      .then(response => {
        this.setState({
          userData: {
            id: response.data.id,
            name: response.data.name,
            dob: response.data.dob,
            email: response.data.email
          }
        });
        this.getUserProfileDetails();
        this.getNumberOfUnreadNotifications();
        this.getNumberOfNewRequests();
      })
      .catch(err => {
        if (!err.response) {
          return this.setState({
            isConnectedToServer: false
          });
        }

        if (err.response.status === 401) {
          tokenService.removeTokens();
          return this.props.history.push('/');
        }
      })
      .finally(() => {
        this.setState({
          isLoading: false
        });
      });
  }

  getUserProfileDetails = () => {
    const userId = this.props.match.params.userId.split('_')[1];

    if (userId) {
      if (!this.state.isLoading) {
        this.setState({
          isLoading: true
        });
      }

      return getUserDetails('/user', { id: userId })
        .then(response => {
          this.setState({
            profileData: { ...response.data }
          });
          this.getUserPosts();
        })
        .catch(err => {
          console.log(err);
        });
    }

    this.setState({
      isLoading: false
    });
  };

  getNumberOfNewRequests = () => {
    getRequestList('/user/requests', { type: 'number' })
      .then(response => {
        this.setState({
          numberOfUnansweredRequests: response.data.numberOfUnansweredRequests
        });
      })
      .catch(error => {
        console.log('Request List Error: ', error);
      });
  };

  getUserPosts = () => {
    const userId = parseInt(this.props.match.params.userId.split('_')[1]);

    if (userId &&
      (this.state.profileData.isFriend || this.state.profileData.isOwner)) {
      return getUserStories('/user/post', { userId: userId })
        .then(response => {
          this.setState({
            userPosts: response.data,
            isLoading: false
          });
        })
        .catch(err => {
          console.log('Unable to load feeds: ', err);
        });
    }

    this.setState({
      isLoading: false
    });
  };

  getCommentList = postId => {
    return new Promise((resolve, reject) => {
      getComments('/user/comment', { postId: postId })
        .then(response => {
          this.setState({
            toUpdatePostId: ''
          });

          resolve(response.data);
        })
        .catch(err => {
          console.log('comments get error: ', err);
        });
    });
  };

  getNumberOfUnreadNotifications = () => {
    // called while loading the user
    getNotificationsList('/user/notifications', { type: 'number' })
      .then(response => {
        this.setState({
          numberOfUnreadNotifications: response.data.numberOfUnreadNotifications
        });
      })
      .catch(err => {
        console.log('Notification number error: ', err);
      });
  };

  handleProfileWrapperClick = e => {
    //to hide the popUp menu.
    if (this.state.isOptionClicked) {
      this.setState({
        isOptionClicked: false
      });
    }
  };

  handleCommentDelete = commentData => {
    return new Promise((resolve, reject) => {
      deleteContent('/user/comment', commentData)
        .then(response => {
          resolve(this.getCommentList(commentData.postId));
        })
        .catch(err => {
          console.log('comment delete error: ', err);
        });
    });
  };

  handleCommentSubmit = commentData => {
    return new Promise((resolve, reject) => {
      postComment('/user/comment', commentData)
        .then(response => {
          resolve(this.getCommentList(commentData.parentPostId));
        })
        .catch(err => {
          console.log('error comment post: ', err);
        });
    });
  };

  handleEditSubmit = submitInfo => {
    if (submitInfo.type === 'post') {
      return updateContent('/user/post', submitInfo.data)
        .then(response => {
          this.getUserPosts();
        })
        .catch(err => {
          console.log('post edit submit error: ', err);
        });
    }

    if (submitInfo.type === 'comment') {
      return new Promise((resolve, reject) => {
        updateContent('/user/comment', submitInfo.data)
          .then(response => {
            this.setState({
              selectionId: {}
            });

            resolve(this.getCommentList(submitInfo.data.postId));
          })
          .catch(err => {
            console.log('comment edit submit error: ', err);
          });
      });
    }
  };

  handleOptionClick = (postId, commentId) => {
    this.setState({
      isOptionClicked: !this.state.isOptionClicked,
      selectedCommentId: commentId,
      selectedPostId: postId
    });
  };

  handlePostDelete = postData => {
    deleteContent('/user/post', postData)
      .then(response => {
        this.getUserPosts();
        this.setState({
          isPostDeleteClicked: false,
          selectionId: {}
        });
      })
      .catch(err => {
        console.log('delete error: ', err);
      });
  };

  handleLogOut = () => {
    logoutUser('/logout', { refreshToken: tokenService.getRefreshToken() })
      .then(() => {
        tokenService.removeTokens();
        this.props.history.push('/');
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleAddFriendClick = () => {
    sendRequest('/user/friend', { recieverId: this.state.profileData.id })
      .then(response => {
        this.getUserProfileDetails();
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleAcceptRequestClick = () => {
    //sends PUT request
    acceptRequest('/user/friend', { senderId: this.state.profileData.id })
      .then(response => {
        this.getUserProfileDetails();
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleDeleteRequestClick = () => {
    deleteRequest('/user/friend', { friendId: this.state.profileData.id })
      .then(response => {
        this.getUserProfileDetails();
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleProfileClick = e => {
    this.props.history.push(`/user/user_${this.state.userData.id}`);
    this.loadProfilePage();
  };

  handleHomeClick = () => {
    return this.props.history.push('/');
  };

  handleProfileNameClick = ownerId => {
    this.props.history.push(`/user/user_${ownerId}`);
    this.loadProfilePage();
  };

  handleProfileEditClick = e => {
    e.preventDefault();

    this.setState({
      isEditProfileClicked: true
    });
  };

  handleCloseEditProfilePopUp = e => {
    e.preventDefault();

    this.setState({
      isEditProfileClicked: false
    });
  };

  handleUserNameEditSubmit = newName => {
    changeUserData('/user', {
      type: 'name',
      submitData: newName
    })
      .then(response => {
        this.loadProfilePage();
      })
      .catch(err => {
        console.log('Name change Error: ', err);
      });
  };

  handleUserDOBEditSubmit = newDate => {
    changeUserData('/user', {
      type: 'dob',
      submitData: newDate
    })
      .then(response => {
        this.loadProfilePage();
      })
      .catch(err => {
        console.log('Name change Error: ', err);
      });
  };

  handleUserPasswordChange = newPassWordData => {
    return changeUserData('/user', {
      type: 'password',
      submitData: newPassWordData
    });
    // .then(response => {
    //   this.loadProfilePage();
    // })
    // .catch(err => {
    //   console.log('Name change Error: ', err);
    // });
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

  render() {
    if (!this.state.isConnectedToServer) {
      return <NoServerConnection />;
    }

    if (this.state.isLoading) {
      return <div>Loading...</div>;
    }

    const profileId = parseInt(this.props.match.params.userId.split('_')[1]);

    if (!this.state.isLoading
      && this.state.profileData.id
      && profileId !== this.state.profileData.id) {
      return (
        <div className="page-not-available">
          <h1>This Page is Not Available!!!</h1>
        </div>
      );
    }

    return (
      <Fragment>
        <Header
          userId={this.state.userData.id}
          profileName={this.state.userData.name}
          numberOfUnansweredRequests={this.state.numberOfUnansweredRequests}
          numberOfUnreadNotifications={
            this.state.numberOfUnreadNotifications
          }
          isInsideUser={true}
          {...this.props}
          onLogOutClick={this.handleLogOut}
          onProfileClick={this.handleProfileClick}
          onHomeClick={this.handleHomeClick}
          searchPeople={this.searchPeople} />
        <div
          className="user-profile-wrapper"
          onClick={this.handleProfileWrapperClick}>
          <div className="profile-header">
            <div
              className="profile-banner"
              style={{
                backgroundImage: `url(userpic.png)`
              }} />
            <div className="profile-banner-cover-layer">
              <div className="profile-image-container">
                <img
                  className="profile-image"
                  src="userpic.png"
                  alt="userpic" />
              </div>
              <div className="profile-name-container">
                <h1>{this.state.profileData.name}</h1>
              </div>
              <div className="frienship-button-container">
                {!this.state.profileData.isOwner &&
                  !this.state.profileData.isFriend &&
                  !this.state.profileData.isRequestSent &&
                  !this.state.profileData.isRequestRecieved ? (
                    <button onClick={this.handleAddFriendClick}>
                      Add Friend +
                    </button>
                  ) : ''}
                {!this.state.profileData.isOwner &&
                  !this.state.profileData.isFriend &&
                  this.state.profileData.isRequestSent &&
                  !this.state.profileData.isRequestRecieved ? (
                    <span>
                      Friend Request Sent
                      <button onClick={this.handleDeleteRequestClick}>
                        Cancel
                      </button>
                    </span>
                  ) : ''}
                {!this.state.profileData.isOwner &&
                  !this.state.profileData.isFriend &&
                  !this.state.profileData.isRequestSent &&
                  this.state.profileData.isRequestRecieved ? (
                    <button onClick={this.handleAcceptRequestClick}>
                      Accept Friend Request
                    </button>
                  ) : ''}
                {!this.state.profileData.isOwner &&
                  !this.state.profileData.isFriend &&
                  !this.state.profileData.isRequestSent &&
                  this.state.profileData.isRequestRecieved ? (
                    <button onClick={this.handleDeleteRequestClick}>
                      Delete Request
                    </button>
                  ) : ''}
                {!this.state.profileData.isOwner &&
                  this.state.profileData.isFriend ? (
                    <span>
                      Friend
                      <button onClick={this.handleDeleteRequestClick}>
                        Unfriend
                      </button>
                    </span>
                  ) : ''}
              </div>
            </div>
          </div>
          <div className="profile-body">
            <div className="profile-intro-container">
              <h3>About</h3>
              <table className="profile-intro-wrapper">
                <tbody>
                  <tr>
                    <th>Name</th>
                    <td>{this.state.profileData.name}</td>
                  </tr>
                  <tr>
                    <th>E-mail</th>
                    <td>{this.state.profileData.email}</td>
                  </tr>
                  <tr>
                    <th>Birth Date</th>
                    <td>{this.state.profileData.dob}</td>
                  </tr>
                </tbody>
              </table>
              {this.state.profileData.isOwner ? (
                <button
                  className="profile-edit-button"
                  type="button"
                  onClick={this.handleProfileEditClick}>
                  Edit profile
                </button>
              ) : ''}
            </div>
            <div className="profile-posts-container">
              <h3>Posts</h3>
              {this.state.profileData.isFriend ||
                this.state.profileData.isOwner ? (
                  <ul className="profile-post-lists">
                    {this.state.userPosts.map(data => (
                      <li key={data.id}>
                        <UserStoryContainer
                          userId={this.state.userData.id}
                          userName={this.state.userData.name}
                          postData={data}
                          getCommentList={this.getCommentList}
                          isOptionClicked={this.state.isOptionClicked}
                          selectedCommentId={this.state.selectedCommentId}
                          selectedPostId={this.state.selectedPostId}
                          onCommentSubmit={this.handleCommentSubmit}
                          onOptionClick={this.handleOptionClick}
                          onEditSubmit={this.handleEditSubmit}
                          onCommentDelete={this.handleCommentDelete}
                          onPostDelete={this.handlePostDelete}
                          onProfileNameClick={this.handleProfileNameClick} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="no-posts-to-show">No Posts to show.</span>
                )}
            </div>
          </div>
        </div>
        {this.state.isEditProfileClicked ? (
          <ProfileEditPopUp
            userData={this.state.userData}
            onNameEditSubmit={this.handleUserNameEditSubmit}
            onDOBEditSubmit={this.handleUserDOBEditSubmit}
            onClosePopUpClick={this.handleCloseEditProfilePopUp}
            onPasswordChangeSubmit={this.handleUserPasswordChange} />
        ) : ''}
      </Fragment>
    );
  }
}

export default UserProfile;
