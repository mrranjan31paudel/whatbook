import React, { Component } from 'react';
import './../../styles/user/active.friend.container.css';

class Activefriend extends Component {
    render() {
        return (
            <div className="active-friend-container">
                <img src="http://localhost:3000/userpic.png" alt="activefriend"></img>
                <span>Active friend name</span>
            </div>
        )
    }
}

export default Activefriend;