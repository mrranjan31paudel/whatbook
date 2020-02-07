import React from 'react';
import './../../styles/user/user.story.container.css';

class Userstorycontainer extends React.Component {
  render() {
    return (
      <div className="user-story-container">
        <div className="poster-title">
          <img src="userpic.png" alt="userpic"></img>
          <span className="poster-name">{this.props.userName}</span>
        </div>
        <span className="post-date-time">{this.props.dateTime}</span>
        <div className="user-story">{this.props.userStory}</div>
      </div>
    )
  }
}

export default Userstorycontainer;