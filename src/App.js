import React, { Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Login from './components/Login';
import SignUp from './components/SignUp';
import User from './components/User';
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
              <ProtectedRoute path="/user" comp={User} />
            </Switch>
          </Router>
        </div>
      </Fragment>
    );
  }
}

export default App;