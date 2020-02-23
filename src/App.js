import React, { Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Login from './components/Login';
import SignUp from './components/SignUp';
import User from './components/User';
import UserProfile from './components/UserProfile';
import People from './components/People';
import Notifications from './components/Notifications';
import Post from './components/Post';
import ProtectedRoute from './components/ProtectedRoute';

import './styles/common/contentContainer.css';


class App extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    return (
      <Fragment>
        <div className="content-container">
          <Router>
            <Switch>
              <Route exact path="/" component={Login} />
              <Route exact path="/signup" component={SignUp} />
              <ProtectedRoute path="/user/:userId/post/:postId" comp={Post} />
              <ProtectedRoute path="/user/:userId" comp={UserProfile} />
              <ProtectedRoute path="/user" comp={User} />
              <ProtectedRoute path="/people" comp={People} />
              <ProtectedRoute path="/notifications" comp={Notifications} />
            </Switch>
          </Router>
        </div>
      </Fragment>
    );
  }
}

export default App;