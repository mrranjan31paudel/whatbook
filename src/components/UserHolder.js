import React from 'react';
import { Link } from 'react-router-dom';

import './../styles/user/active_friend_container.css';

const UserHolder = props => {
  return (
    <div className="active-friend-container">
      <img src="userpic.png" alt="UserHolder" />
      <span>
        <Link to={`/user/user_${props.userData.id}`}>
          {props.userData.name}
        </Link>
      </span>
    </div>
  );
}

export default UserHolder;
