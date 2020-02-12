import React, { Fragment } from 'react';

import { getUserDetails, getUserStories, createNewPost, postComment, getComments, updateContent, deleteContent } from './../services/user';
import tokenService from './../services/token';
import UserStoryContainer from './sub-components/UserStoryContainer';
import ActiveFriend from './sub-components/ActiveFriend';
import Header from './Header';
import PopUpMenu from './PopUpMenu';

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
      isOptionSelected: false,
      selectedOptionConfig: {},
      selectionId: {
        type: '',
        postId: '',
        commentId: ''
      },
      toUpdatePostId: {}
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
          userStories: response.data,
          selectionId: {}
        });
        console.log('user stories: ', this.state.userStories);
      })
      .catch(err => {
        console.log('Unable to load feeds: ', err);
      });
  }

  getCommentList = (postId) => {
    console.log('get comment list called');
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

  handlePostFieldChange = (e) => {
    this.setState({
      postFieldData: e.target.value
    });
  }

  handlepost = () => {
    if (this.state.postFieldData) {
      createNewPost('/user', {
        postData: this.state.postFieldData
      })
        .then(response => {
          console.log('posted: ', response);
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

  handleCommentSubmit = (e, commentText, postId) => {
    e.preventDefault();

    return new Promise((resolve, reject) => {
      postComment('/user/comment', {
        postId: postId,
        commentText: commentText
      })
        .then(response => {
          resolve(this.getCommentList(postId));
        })
        .catch(err => {
          console.log('error comment post: ', err);
        });
    })
  }

  handleOptionClick = (data) => {
    this.setState({
      isOptionSelected: !this.state.isOptionSelected,
      selectedOptionConfig: data
    });
  }

  handleOptionItemClick = (value) => {
    if (value === "Delete") {
      if (this.state.selectedOptionConfig.type === 'post') {
        const postData = {
          postId: this.state.selectedOptionConfig.postId,
          userId: this.state.selectedOptionConfig.posterId
        }
        deleteContent('/user', postData)
          .then(response => {
            this.getNewsFeed();
          })
          .catch(err => {
            console.log('delete error: ', err);
          });
      }
      else if (this.state.selectedOptionConfig.type === 'comment') {
        const commentData = {
          commentId: this.state.selectedOptionConfig.commentId,
          userId: this.state.selectedOptionConfig.commenterId,
          postId: this.state.selectedOptionConfig.postId,
          postOwnerId: this.state.selectedOptionConfig.posterId
        }
        deleteContent('/user/comment', commentData)
          .then(response => {
            this.setState({
              toUpdatePostId: {
                postId: this.state.selectedOptionConfig.postId,
                commentId: this.state.selectedOptionConfig.commentId
              }
            });
          })
          .catch(err => {
            console.log('delete error: ', err);
          });
      }
      this.setState({
        isOptionSelected: !this.state.isOptionSelected,
        selectedOptionConfig: {}
      });
    }
    else if (value === "Edit") {
      this.setState({
        isOptionSelected: !this.state.isOptionSelected,
        selectedOptionConfig: {},
        selectionId: {
          type: this.state.selectedOptionConfig.type,
          postId: this.state.selectedOptionConfig.postId,
          commentId: this.state.selectedOptionConfig.commentId ? this.state.selectedOptionConfig.commentId : ''
        }
      });
    }
  }

  handleCancelEdit = () => {
    this.setState({
      selectionId: {}
    })
  }

  handleEditSubmit = (submitInfo) => {
    if (submitInfo.type === 'post') {
      updateContent('/user', submitInfo.data)
        .then(response => {
          this.getNewsFeed();
        })
        .catch(err => {
          console.log('err', err);
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
            console.log('err', err);
          });
      })
    }
  }

  render() {
    return (
      <Fragment>
        <Header profileName={this.state.userData.name} isInsideUser={true} {...this.props} />
        <div className="user-wrapper">
          <div className="profile-info-container">
            <img src="userpic.png" alt="user"></img>
            <span>
              {this.state.userData.name}
            </span>
          </div>
          <div className="news-feed-container">
            <div className="post-field-wrapper">
              <textarea rows="4" cols="50" name="post-field" placeholder="What are you thinking today?" onChange={this.handlePostFieldChange} value={this.state.postFieldData} ></textarea>
              <button onClick={this.handlepost}>Post</button>
            </div>
            <hr />

            <div className="news-feed-wrapper">
              <h3>Feed</h3>
              <ul className="user-stroy-list">
                {this.state.userStories.map((data, index) => <li key={data.id}>
                  <UserStoryContainer userId={this.state.userData.id} postData={data} onSubmit={this.handleCommentSubmit} getCommentList={this.getCommentList} postOnSelection={data.id === this.state.selectionId.postId ? this.state.selectionId : ''} onOptionClick={this.handleOptionClick} onCommentOptionClick={this.handleOptionClick} onCancelEditClick={this.handleCancelEdit} onEditSubmit={this.handleEditSubmit} deletedContent={this.state.selectedOptionConfig ? this.state.selectedOptionConfig.type : ''} toUpdatePostId={this.state.toUpdatePostId && this.state.toUpdatePostId.postId === data.id ? this.state.toUpdatePostId : ''} />
                </li>)}
              </ul>
            </div>
          </div>
          <div className="active-friendlist-container">
            <h4>Active Friends</h4>
            {/* place a list of friends here */}
            <ActiveFriend />
          </div>
          {this.state.isOptionSelected ? <PopUpMenu config={this.state.selectedOptionConfig} onItemClick={this.handleOptionItemClick} /> : ''}
        </div>
      </Fragment>
    );
  }
}

export default User;