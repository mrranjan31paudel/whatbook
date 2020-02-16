import React, { Fragment } from 'react';

import { getUserDetails, getUserStories, createNewPost, postComment, getComments, updateContent, deleteContent } from './../services/user';
import tokenService from './../services/token';
import UserStoryContainer from './sub-components/UserStoryContainer';
import ActiveFriend from './sub-components/ActiveFriend';
import Header from './Header';

import './../styles/user/user.wrapper.css';
import './../styles/user/profile.info.wrapper.css';
import './../styles/user/news.feed.wrapper.css';
import './../styles/user/friendlist.wrapper.css';

class User extends React.Component {

  constructor() {
    super();
    this.state = {
      userData: {
        name: '',
        dob: '',
        email: ''
      },
      postFieldData: '',
      userStories: [],
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
        this.getNewsFeed();
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          tokenService.removeTokens();
          return this.props.history.push('/');
        }
      });
  }

  getNewsFeed = () => {
    getUserStories('/user/feeds')
      .then(response => {
        this.setState({
          ...this.state,
          userStories: response.data
        });
      })
      .catch(err => {
        console.log('Unable to load feeds: ', err);
      });
  }

  getCommentList = (postId) => {
    return new Promise((resolve, reject) => {
      getComments('/user/comment', {
        postId: postId
      })
        .then(response => {
          console.log('commentList  after: ', response.data);
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

  handleOptionClick = (postId, commentId) => {
    this.setState({
      isOptionClicked: !this.state.isOptionClicked,
      selectedCommentId: commentId,
      selectedPostId: postId
    })
  }

  handlePostFieldChange = (e) => {
    this.setState({
      postFieldData: e.target.value
    });
  }

  handlePost = () => {
    if (this.state.postFieldData) {
      createNewPost('/user', {
        postData: this.state.postFieldData
      })
        .then(response => {
          this.setState({
            postFieldData: ''
          });
          this.getNewsFeed();
        })
        .catch(err => {
          console.log('not posted: ', err);
        });
    }
  }

  handleEditSubmit = (submitInfo) => {
    console.log('type:', submitInfo.type);
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

  handleCommentSubmit = (commentData) => {
    console.log('submit : ', commentData);
    return new Promise((resolve, reject) => {
      postComment('/user/comment', commentData)
        .then(response => {
          console.log('response: ', response);
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

  handleUserWrapperClick = (e) => { //to hide the popUp menu.
    if (this.state.isOptionClicked) {
      this.setState({
        isOptionClicked: false
      })
    }
  }

  render() {
    return (
      <Fragment>
        <Header profileName={this.state.userData.name} isInsideUser={true} {...this.props} />
        <div className="user-wrapper" onClick={this.handleUserWrapperClick}>
          <div className="profile-info-container">
            <img src="userpic.png" alt="user"></img>
            <span>
              {this.state.userData.name}
            </span>
          </div>
          <div className="news-feed-container">
            <div className="post-field-wrapper">
              <textarea rows="4" cols="50" name="post-field" placeholder="What are you thinking today?" onChange={this.handlePostFieldChange} value={this.state.postFieldData} ></textarea>
              <button onClick={this.handlePost}>Post</button>
            </div>
            <hr />

            <div className="news-feed-wrapper">
              <h3>Feed</h3>
              <ul className="user-stroy-list">
                {this.state.userStories.map((data, index) => <li key={data.id}>
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
                    onPostDelete={this.handlePostDelete} />
                </li>)}
              </ul>
            </div>
          </div>
          <div className="active-friendlist-container">
            <h4>Active Friends</h4>
            {/* place a list of friends here */}
            <ActiveFriend />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default User;