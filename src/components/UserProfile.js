import React, { Fragment } from 'react';

import { getUserDetails, getUserStories, updateContent, postComment, deleteContent, getComments, logoutUser, sendRequest, acceptRequest, deleteRequest } from './../services/user';
import tokenService from './../services/token';
import { localhost } from './../constants/config';

import Header from './Header';
import UserStoryContainer from './sub-components/UserStoryContainer';
import NoServerConnection from './NoServerConnection';


import './../styles/user/userProfile.css';

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
      isConnectedToServer: true,
      isLoading: false,
      isOptionClicked: false,
      selectedCommentId: null,
      selectedPostId: null
    }
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    })
    getUserDetails('/user')

      .then(response => {
        console.log("RESPONSE: ", response);
        this.setState({
          userData: {
            id: response.data.id,
            name: response.data.name,
            dob: response.data.dob,
            email: response.data.email
          }
        });
        this.getUserProfileDetails();
      })
      .catch((err) => {
        console.log('ERROR: ', err);
        if (!err.response) {
          this.setState({
            isConnectedToServer: false
          });
        }
        else if (err.response && err.response.status === 401) {
          tokenService.removeTokens();
          return this.props.history.push('/');
        }
      });


  }

  getUserProfileDetails = () => {

    const userId = parseInt(this.props.match.params.userId.split('_')[1]);
    if (userId) {
      this.setState({
        isLoading: true
      })
      getUserDetails('/user', {
        id: userId
      })
        .then(response => {
          this.setState({
            profileData: {
              id: response.data.id,
              name: response.data.name,
              dob: response.data.dob,
              email: response.data.email,
              isOwner: response.data.isOwner,
              isFriend: response.data.isFriend,
              isRequestSent: response.data.isRequestSent,
              isRequestRecieved: response.data.isRequestRecieved
            },
            isLoading: false
          });
          this.getUserPosts();
        })
        .catch((err) => {
          console.log(err);
        });
    }
    else {
      this.setState({
        isLoading: false
      })
    }
  }

  getUserPosts = () => {
    const userId = parseInt(this.props.match.params.userId.split('_')[1]);
    if (userId) {
      getUserStories('/user/post', {
        id: userId
      })
        .then(response => {
          this.setState({
            ...this.state,
            userPosts: response.data
          });
        })
        .catch(err => {
          // console.log('Unable to load feeds: ', err);
        });
    }
    else {
      this.setState({
        isLoading: false
      })
    }
  }

  getCommentList = (postId) => {
    return new Promise((resolve, reject) => {
      getComments('/user/comment', {
        postId: postId
      })
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
  }

  handleProfileWrapperClick = (e) => { //to hide the popUp menu.
    if (this.state.isOptionClicked) {
      this.setState({
        isOptionClicked: false
      })
    }
  }

  handleCommentDelete = (commentData) => {
    return new Promise((resolve, reject) => {
      deleteContent('/user/comment', commentData)
        .then(response => {
          resolve(this.getCommentList(commentData.postId));
        })
        .catch(err => {
          console.log('comment delete error: ', err);
        });
    })
  }

  handleCommentSubmit = (commentData) => {

    return new Promise((resolve, reject) => {
      postComment('/user/comment', commentData)
        .then(response => {

          resolve(this.getCommentList(commentData.parentPostId));
        })
        .catch(err => {
          console.log('error comment post: ', err);
        });
    })
  }

  handleEditSubmit = (submitInfo) => {

    if (submitInfo.type === 'post') {
      updateContent('/user/post', submitInfo.data)
        .then(response => {
          this.getUserPosts();
        })
        .catch(err => {
          console.log('post edit submit error: ', err);
        });
    }
    else if (submitInfo.type === 'comment') {
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
      })
    }
  }

  handleOptionClick = (postId, commentId) => {
    this.setState({
      isOptionClicked: !this.state.isOptionClicked,
      selectedCommentId: commentId,
      selectedPostId: postId
    })
  }

  handlePostDelete = (postData) => {
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

  handleAddFriendClick = () => {
    sendRequest('/user/friend', {
      recieverId: this.state.profileData.id
    })
      .then(response => {
        this.getUserProfileDetails();
      })
      .catch(error => {
        console.log(error);
      })
  }

  handleAcceptRequestClick = () => {//sends PUT request
    acceptRequest('/user/friend', {
      senderId: this.state.profileData.id
    })
      .then(response => {
        this.getUserProfileDetails();
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleDeleteRequestClick = () => {
    deleteRequest('/user/friend', {
      friendId: this.state.profileData.id
    })
      .then(response => {
        this.getUserProfileDetails();
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleProfileClick = (e) => {

    this.props.history.push(`/user/user_${this.state.userData.id}`);
    window.location.reload();
    this.setState({
      isLoading: true
    })
  }

  handleHomeClick = () => {
    return this.props.history.push('/');
  }

  handleProfileNameClick = (ownerId) => {
    this.props.history.push(`/user/user_${ownerId}`);
    window.location.reload();
    this.setState({
      isLoading: true
    })
  }

  render() {
    if (this.state.isConnectedToServer) {
      const profileId = parseInt(this.props.match.params.userId.split('_')[1]);

      if (profileId === this.state.profileData.id) {
        return (
          <Fragment>
            <Header userId={this.state.userData.id} profileName={this.state.userData.name} isInsideUser={true} {...this.props} onLogOutClick={this.handleLogOut} onProfileClick={this.handleProfileClick} onHomeClick={this.handleHomeClick} />
            <div className="user-profile-wrapper" onClick={this.handleProfileWrapperClick}>
              <div className="profile-header">
                <div className="profile-banner" style={{ backgroundImage: `http://${localhost}:3000/userpic.png` }}>
                </div>
                <div className="profile-banner-cover-layer">
                  <div className="profile-image-container">
                    <img className="profile-image" src={`http://${localhost}:3000/userpic.png`} alt="userpic"></img>
                  </div>
                  <div className="profile-name-container">
                    <h1>{this.state.profileData.name}</h1>
                  </div>
                  <div className="frienship-button-container">
                    {
                      !this.state.profileData.isOwner && !this.state.profileData.isFriend && !this.state.profileData.isRequestSent && !this.state.profileData.isRequestRecieved ?
                        <button onClick={this.handleAddFriendClick}>Add Friend +</button> :
                        ''
                    }
                    {
                      !this.state.profileData.isOwner && !this.state.profileData.isFriend && this.state.profileData.isRequestSent && !this.state.profileData.isRequestRecieved ?
                        <span>Friend Request Sent<button onClick={this.handleDeleteRequestClick}>Cancel</button></span> :
                        ''
                    }
                    {
                      !this.state.profileData.isOwner && !this.state.profileData.isFriend && !this.state.profileData.isRequestSent && this.state.profileData.isRequestRecieved ?
                        <button onClick={this.handleAcceptRequestClick}>Accept Friend Request</button> :
                        ''
                    }
                    {
                      !this.state.profileData.isOwner && !this.state.profileData.isFriend && !this.state.profileData.isRequestSent && this.state.profileData.isRequestRecieved ?
                        <button onClick={this.handleDeleteRequestClick}>Delete Request</button> :
                        ''
                    }
                    {
                      !this.state.profileData.isOwner && this.state.profileData.isFriend ?
                        <span>Friend<button onClick={this.handleDeleteRequestClick}>Unfriend</button></span> :
                        ''
                    }

                  </div>
                </div>
              </div>
              <div className="profile-body">
                <div className="profile-intro-container">
                  <h3>
                    About
                </h3>
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
                  {this.state.profileData.isOwner ? < button className="profile-edit-button" type="button" onClick={this.handleProfileEditClick} >Edit profile</button> : ''}
                </div>
                <div className="profile-posts-container">
                  <h3>
                    Posts
                </h3>
                  <ul className="profile-post-lists">
                    {this.state.userPosts.map((data, index) => <li key={data.id}>
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
                        onProfileNameClick={this.handleProfileNameClick}
                      />
                    </li>)}
                  </ul>
                </div>
              </div>
            </div>
          </Fragment >
        );
      }
      else if (this.state.isLoading) {
        return (
          <div>

          </div>
        );
      }
      else if (!this.state.isLoading && profileId !== this.state.profileData.id) {
        return (
          <div className="page-not-available">
            <h1>
              This Page is Not Available!!!
          </h1>
          </div>
        );
      }
    }
    else {
      return (
        <NoServerConnection />
      );
    }
  }
}

export default UserProfile;