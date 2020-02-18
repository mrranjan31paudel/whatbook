import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import tokenService from './../services/token';

class ProtectedRoute extends React.Component {
    isLoggedIn = () => {
        if (tokenService.getAccessToken()) {
            return true;
        }
        return false;
    }
    render() {
        const Component = this.props.comp;
        return (
            <Route path={this.props.path} {...this.props} render={props => {
                return (
                    this.isLoggedIn() ? <Component {...this.props} {...props} /> : <Redirect to="/" />
                );
            }} />
        );
    }
}

export default ProtectedRoute;