import React, { Fragment } from 'react';

import { getUserDetails, getUserStories, createNewPost } from './../services/user';
import tokenService from './../services/token';
import Userstorycontainer from './sub-components/Userstorycontainer';
import Activefriend from './sub-components/Activefriend';
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
      })
      .catch(err => {
        console.log('not posted: ', err);
      });
  }

  parseDateTime = (dateTime) => {
    let parsedValue = dateTime.replace('T', ' at ').replace(':00.000Z', '');
    return parsedValue;
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
                {this.state.userStories.map((data, index) => <li key={index}>
                  <Userstorycontainer userName={data.name} dateTime={this.parseDateTime(data.date_time)} userStory={data.content} />
                </li>)}
              </ul>
            </div>
          </div>
          <div className="active-friendlist-container">
            <h4>Active Friends</h4>
            {/* place a list of friends here */}
            <Activefriend />
            <Activefriend />
            <Activefriend />
            <Activefriend />
            <Activefriend />
            <Activefriend />
            <Activefriend />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default User;