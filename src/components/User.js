import React, { Fragment } from 'react';
import { http } from './../configs/lib.imports';
// const TOKEN = localStorage.getItem('myAccessToken');
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
      }
    }
  }

  componentDidMount() {
    const ACC_TOKEN = localStorage.getItem('myAccessToken');
    http.get('/user', {
      headers: {
        authorization: ACC_TOKEN
      }
    })
      .then(response => {
        this.setState({
          userData: {
            name: response.data.name,
            dob: response.data.dob,
            email: response.data.email
          }
        });
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 403) {
          const REF_TOKEN = localStorage.getItem('myRefreshToken');
          http.post('/tokenrenew', {
            accessToken: ACC_TOKEN,
            refreshToken: REF_TOKEN
          })
            .then(response => {
              localStorage.setItem('myAccessToken', response.data.accessToken);
              localStorage.setItem('myRefreshToken', response.data.refreshToken);
              http.get('/user', {
                headers: {
                  authorization: localStorage.getItem('myAccessToken')
                }
              })
                .then(response => {
                  this.setState({
                    userData: {
                      name: response.data.name,
                      dob: response.data.dob,
                      email: response.data.email
                    }
                  });
                })
                .catch(err => {
                  console.log('error fdf: ', err);
                })
            })
            .catch(err => {
              localStorage.removeItem('myAccessToken');
              localStorage.removeItem('myRefreshToken');
              this.props.history.push('/');
            });
        }
      });
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
              <textarea rows="4" cols="50" name="post-field" placeholder="What are you thinking today?" ></textarea>
              <button>Post</button>
            </div>
            <div className="news-feed-wrapper">
              <h3>Feed</h3>
              <Userstorycontainer />
              <Userstorycontainer />
              <Userstorycontainer />
              <Userstorycontainer />
              <Userstorycontainer />
            </div>
          </div>
          <div className="active-friendlist-container">
            <h4>Active Friends</h4>
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