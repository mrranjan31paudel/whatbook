import React, { Fragment } from 'react';

import { getUserDetails, getUserStories, updateContent, postComment, deleteContent, getComments } from './../services/user';
import tokenService from './../services/token';

import Header from './Header';
import UserStoryContainer from './sub-components/UserStoryContainer';

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
        isOwner: ''
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
      })
      .catch((err) => {
        console.log('ERROR: ', err);
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
    this.setState({
      isLoading: true
    })

  }

  getUserProfileDetails = () => {
    const userId = parseInt(this.props.match.params.userId.split('_')[1]);
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
            isOwner: response.data.isOwner
          },
          isLoading: false
        });
        this.getUserPosts();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getUserPosts = () => {
    const userId = parseInt(this.props.match.params.userId.split('_')[1]);
    getUserStories('/user/feeds', {
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
      updateContent('/user', submitInfo.data)
        .then(response => {
          this.getNewsFeed();
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
    deleteContent('/user', postData)
      .then(response => {
        this.getNewsFeed();
        this.setState({
          isPostDeleteClicked: false,
          selectionId: {}
        });
      })
      .catch(err => {
        console.log('delete error: ', err);
      });
  }

  render() {
    const profileId = parseInt(this.props.match.params.userId.split('_')[1]);

    if (profileId === this.state.profileData.id) {
      return (
        <Fragment>
          <Header userId={this.state.userData.id} profileName={this.state.userData.name} isInsideUser={true} {...this.props} />
          <div className="user-profile-wrapper" onClick={this.handleProfileWrapperClick}>
            <div className="profile-header">
              <div className="profile-banner">
              </div>
              <div className="profile-banner-cover-layer">
                <div className="profile-image-container">
                  <img className="profile-image" src="http://localhost:3000/userpic.png" alt="userpic"></img>
                </div>
                <div className="profile-name-container">
                  <h1>{this.state.profileData.name}</h1>
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
                {this.state.profileData.isOwner ? < button type="button" >Edit profile</button> : ''}
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
                      onPostDelete={this.handlePostDelete} />
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
    else {
      return (
        <div className="page-not-available">
          <h1>
            This Page is Not Available!!!
          </h1>
        </div>
      );
    }
  }
}

export default UserProfile;