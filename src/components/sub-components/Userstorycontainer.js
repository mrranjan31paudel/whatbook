import React from 'react';
import './../../styles/user/user.story.container.css';

class Userstorycontainer extends React.Component {
  render() {
    return (
      <div className="user-story-container">
        <div className="poster-title">
          <img src="userpic.png" alt="userpic"></img>
          <span className="poster-name">Poster's name</span>
        </div>
        <span className="post-date-time">Date time here.</span>
        <div className="user-story">Poster's story</div>
      </div>
    )
  }
}

export default Userstorycontainer;