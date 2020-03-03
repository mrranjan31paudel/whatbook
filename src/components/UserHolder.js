import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { localhost } from '../constants/config';

import './../styles/user/active.friend.container.css';

class UserHolder extends Component {
    render() {
        return (
            <div className="active-friend-container">
                <img src={`http://${localhost}:3000/userpic.png`} alt="UserHolder"></img>
                <span><Link to={`/user/user_${this.props.userData.id}`}>{this.props.userData.name}</Link></span>
            </div >
        )
    }
}

export default UserHolder;