import React, { Fragment } from 'react';

import { getUserDetails, getUserStories, createNewPost, postComment, getComments } from './../services/user';
import tokenService from './../services/token';
import parseDateTime from './../utils/dateParser';
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
      userStories: []
    }
  }

  componentDidMount() {
    getUserDetails('/user')
      .then(response => {
        this.setState({
          userData: {
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
        console.log('user stories: ', this.state.userStories);
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
                  <UserStoryContainer postId={data.id} userName={data.name} dateTime={parseDateTime(data.date_time)} userStory={data.content} onSubmit={this.handleCommentSubmit} getCommentList={this.getCommentList} />
                </li>)}
              </ul>
            </div>
          </div>
          <div className="active-friendlist-container">
            <h4>Active Friends</h4>
            {/* place a list of friends here */}
            <ActiveFriend />
            <ActiveFriend />
            <ActiveFriend />
            <ActiveFriend />
            <ActiveFriend />
            <ActiveFriend />
            <ActiveFriend />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default User;