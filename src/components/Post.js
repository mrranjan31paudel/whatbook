import React, { Fragment } from 'react';

import { getUserDetails, getUserStories, getRequestList, getNotificationsList, updateContent, postComment, deleteContent, getComments } from './../services/user';
import tokenService from './../services/token';

import Header from './Header';
import UserStoryContainer from './UserStoryContainer';

import './../styles/user/singlePost.css';

class Post extends React.Component {

  constructor() {
    super();

    this.state = {
      userData: {
        id: '',
        name: '',
        dob: '',
        email: ''
      },
      isOptionClicked: false,
      selectedCommentId: null,
      selectedPostId: null,
      numberOfUnansweredRequests: 0,
      numberOfUnreadNotifications: 0,
      userPost: []
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

          this.getUserPost();
          this.getNumberOfNewRequests();
          this.getNumberOfUnreadNotifications();
        }
      })
      .catch((err) => {
        console.log('Component mount error: ', err)
        if (err.response && err.response.status === 401) {
          tokenService.removeTokens();
          return this.props.history.push('/');
        }
      });
  }

  getUserPost = () => {
    console.log('PARAMS: ', this.props.match.params);
    const ownerId = this.props.match.params.userId.split('_')[1];
    const postId = this.props.match.params.postId.split('_')[1];
    getUserStories('/user/post', {
      ownerId: ownerId,
      postId: postId
    })
      .then(response => {
        console.log('POst response: ', response);
        this.setState({
          userPost: response.data
        });
      })
      .catch(err => {
        console.log('Unable to load post: ', err);
      });
  }

  getCommentList = (postId) => {
    console.log('USER POST: ', this.state.userPost);
    console.log('post id in getcommentlist: ', postId);
    return new Promise((resolve, reject) => {
      getComments('/user/comment', {
        postId: postId
      })
        .then(response => {
          resolve(response.data);
        })
        .catch(err => {
          console.log('comments get error: ', err);
        });
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

  getNumberOfUnreadNotifications = () => { // called while loading the user
    getNotificationsList('/user/notifications', {
      type: 'number'
    })
      .then(response => {
        console.log('notifications response: ', response);
        this.setState({
          numberOfUnreadNotifications: response.data.numberOfUnreadNotifications
        });
      })
      .catch(err => {
        console.log('Notification number error: ', err);
      });
  }

  handleOptionClick = (postId, commentId) => {
    this.setState({
      isOptionClicked: !this.state.isOptionClicked,
      selectedCommentId: commentId,
      selectedPostId: postId
    })
  }

  handleEditSubmit = (submitInfo) => {

    if (submitInfo.type === 'post') {
      updateContent('/user/post', submitInfo.data)
        .then(response => {

          this.getUserPost();
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

  handlePostDelete = (postData) => {
    deleteContent('/user/post', postData)
      .then(response => {
        this.getUserPost();
        this.setState({
          isPostDeleteClicked: false,
          selectionId: {}
        });
      })
      .catch(err => {
        console.log('delete error: ', err);
      });
  }

  handleUserWrapperClick = (e) => { //to hide the popUp menu.
    if (this.state.isOptionClicked) {
      this.setState({
        isOptionClicked: false
      })
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

  render() {
    return (
      <Fragment>
        <Header
          userId={this.state.userData.id}
          profileName={this.state.userData.name}
          numberOfUnansweredRequests={this.state.numberOfUnansweredRequests}
          numberOfUnreadNotifications={this.state.numberOfUnreadNotifications}
          isInsideUser={true}
          {...this.props}
          onLogOutClick={this.handleLogOut}
          onProfileClick={this.handleProfileClick}
          onHomeClick={this.handleHomeClick}
        />
        <div className="user-post-container" onClick={this.handleUserWrapperClick}>
          <div className="user-post-wrapper">
            {
              this.state.userPost.length > 0 ?
                <UserStoryContainer
                  userId={this.state.userData.id}
                  userName={this.state.userData.name}
                  postData={this.state.userPost[0]}
                  getCommentList={this.getCommentList}
                  isOptionClicked={this.state.isOptionClicked}
                  selectedCommentId={this.state.selectedCommentId}
                  selectedPostId={this.state.selectedPostId}
                  onOptionClick={this.handleOptionClick}
                  onCommentSubmit={this.handleCommentSubmit}
                  onEditSubmit={this.handleEditSubmit}
                  onCommentDelete={this.handleCommentDelete}
                  onPostDelete={this.handlePostDelete}
                  onProfileNameClick={this.handleProfileNameClick}
                /> : ''
            }
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Post;