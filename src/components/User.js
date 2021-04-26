import React, { Fragment } from 'react';

import { getPeopleList, getUserDetails } from './../services/user';
import { logoutUser } from './../services/login';
import {
  getUserStories,
  deletePost,
  updatePost,
  createNewPost,
} from './../services/post';
import {
  postComment,
  getComments,
  updateComment,
  deleteComment,
} from './../services/comment';
import { getRequestList } from './../services/friend';
import { getNotificationsList } from './../services/notification';
import Header from './Header';
// import UserHolder from './UserHolder';
import tokenService from './../services/token';
import NoServerConnection from './NoServerConnection';
import UserStoryContainer from './UserStoryContainer';

import './../styles/user/user_wrapper.css';
import './../styles/user/news_feed_wrapper.css';
import './../styles/user/friendlist_wrapper.css';
import './../styles/user/profile_info_wrapper.css';

class User extends React.Component {
  constructor() {
    super();
    this.state = {
      userData: {
        id: '',
        name: '',
        dob: '',
        email: '',
      },
      postFieldData: '',
      userStories: [],
      userNotifications: [],
      activeFriendList: [],
      numberOfUnansweredRequests: 0,
      numberOfUnreadNotifications: 0,
      isOptionClicked: false,
      selectedCommentId: null,
      selectedPostId: null,
      isConnectedToServer: true,
    };
  }

  componentDidMount() {
    getUserDetails()
      .then((response) => {
        if (response) {
          this.setState({
            userData: {
              id: response.data.id,
              name: response.data.name,
              dob: response.data.dob,
              email: response.data.email,
            },
          });
          this.getNewsFeed();
          this.getNumberOfNewRequests();
          this.getNumberOfUnreadNotifications();
        }
      })
      .catch((err) => {
        if (!err.response) {
          return this.setState({
            isConnectedToServer: false,
          });
        }

        if (err.response.status === 401) {
          tokenService.removeTokens();
          return this.props.history.push('/');
        }
      });
  }

  getNumberOfNewRequests = () => {
    getRequestList({ type: 'number' })
      .then((response) => {
        this.setState({
          numberOfUnansweredRequests: response.data.numberOfUnansweredRequests,
        });
      })
      .catch((error) => {
        console.log('Request List Error: ', error);
      });
  };

  getNewsFeed = () => {
    getUserStories()
      .then((response) => {
        this.setState({
          ...this.state,
          userStories: response.data,
        });
      })
      .catch((err) => {
        console.log('Unable to load posts: ', err);
      });
  };

  getCommentList = (postId) => {
    return new Promise((resolve, reject) => {
      getComments({ postId: postId })
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  getNumberOfUnreadNotifications = () => {
    // called while loading the user
    getNotificationsList({ type: 'number' })
      .then((response) => {
        this.setState({
          numberOfUnreadNotifications:
            response.data.numberOfUnreadNotifications,
        });
      })
      .catch((err) => {
        console.log('Notification number error: ', err);
      });
  };

  handlePostFieldChange = (e) => {
    this.setState({ postFieldData: e.target.value });
  };

  handlePost = () => {
    if (this.state.postFieldData) {
      createNewPost({ postData: this.state.postFieldData })
        .then((response) => {
          this.setState({
            postFieldData: '',
          });
          this.getNewsFeed();
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            tokenService.removeTokens();
            this.props.history.push('/');
          }
        });
    }
  };

  handleOptionClick = (postId, commentId) => {
    this.setState({
      isOptionClicked: !this.state.isOptionClicked,
      selectedCommentId: commentId,
      selectedPostId: postId,
    });
  };

  handleEditSubmit = (submitInfo) => {
    if (submitInfo.type === 'post') {
      return updatePost(submitInfo.data)
        .then((response) => {
          this.getNewsFeed();
        })
        .catch((err) => {
          console.log('post edit submit error: ', err);
        });
    }

    if (submitInfo.type === 'comment') {
      return new Promise((resolve, reject) => {
        updateComment(submitInfo.data)
          .then((response) => {
            this.setState({
              selectionId: {},
            });

            resolve(this.getCommentList(submitInfo.data.postId));
          })
          .catch((err) => {
            console.log('comment edit submit error: ', err);
          });
      });
    }
  };

  handleCommentSubmit = (commentData) => {
    return new Promise((resolve, reject) => {
      postComment(commentData)
        .then((response) => {
          resolve(this.getCommentList(commentData.parentPostId));
        })
        .catch((err) => {
          console.log('error comment post: ', err);
        });
    });
  };

  handleCommentDelete = (commentData) => {
    return new Promise((resolve, reject) => {
      deleteComment(commentData)
        .then((response) => {
          resolve(this.getCommentList(commentData.postId));
        })
        .catch((err) => {
          console.log('comment delete error: ', err);
        });
    });
  };

  handlePostDelete = (postData) => {
    deletePost(postData)
      .then((response) => {
        this.getNewsFeed();
        this.setState({
          isPostDeleteClicked: false,
          selectionId: {},
        });
      })
      .catch((err) => {
        console.log('delete error: ', err);
      });
  };

  handleUserWrapperClick = (e) => {
    //to hide the popUp menu.
    if (this.state.isOptionClicked) {
      this.setState({
        isOptionClicked: false,
      });
    }
  };

  handleLogOut = () => {
    logoutUser({ refreshToken: tokenService.getRefreshToken() })
      .then(() => {
        tokenService.removeTokens();
        this.props.history.push('/');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  searchPeople = (searchText) => {
    return new Promise((resolve, reject) => {
      getPeopleList({
        userId: this.state.userData.id,
        searchText: searchText,
      })
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => console.log('Sear result ERROR: ', err));
    });
  };

  handleProfileClick = () => {
    return this.props.history.push(`/user/user_${this.state.userData.id}`);
  };

  handleHomeClick = () => {
    return this.props.history.push('/user');
  };

  handleProfileNameClick = (ownerId) => {
    return this.props.history.push(`/user/user_${ownerId}`);
  };

  render() {
    if (!this.state.isConnectedToServer) {
      return <NoServerConnection />;
    }

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
          searchPeople={this.searchPeople}
        />

        <div className="user-wrapper" onClick={this.handleUserWrapperClick}>
          <div className="profile-info-container">
            <img src="userpic.png" alt="user" />
            <span>{this.state.userData.name}</span>
          </div>
          <div className="news-feed-container">
            <div className="post-field-wrapper">
              <textarea
                rows="4"
                cols="50"
                name="post-field"
                placeholder="What are you thinking today?"
                onChange={this.handlePostFieldChange}
                value={this.state.postFieldData}
              />
              <button onClick={this.handlePost}>Post</button>
            </div>
            <hr />

            <div className="news-feed-wrapper">
              <h3>Feed</h3>
              <ul className="user-stroy-list">
                {this.state.userStories.map((data) => (
                  <li key={data.id}>
                    <UserStoryContainer
                      userId={this.state.userData.id}
                      userName={this.state.userData.name}
                      postData={data}
                      onCommentSubmit={this.handleCommentSubmit}
                      getCommentList={this.getCommentList}
                      isOptionClicked={this.state.isOptionClicked}
                      selectedCommentId={this.state.selectedCommentId}
                      selectedPostId={this.state.selectedPostId}
                      onOptionClick={this.handleOptionClick}
                      onEditSubmit={this.handleEditSubmit}
                      onCommentDelete={this.handleCommentDelete}
                      onPostDelete={this.handlePostDelete}
                      onProfileNameClick={this.handleProfileNameClick}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* <div className="active-friendlist-container">
              <h4>Active Friends</h4>
              place a list of friends here
              <UserHolder />
            </div> */}
        </div>
      </Fragment>
    );
  }
}

export default User;
