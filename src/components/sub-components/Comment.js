import React from 'react';

import './../../styles/user/comment.css';

class Comment extends React.Component {
  render() {
    return (
      <div className="comment-container">
        <div className="commenter-name">{this.props.commenterName}</div>
        <div className="comment-time">{this.props.commentTime}</div>
        <div className="comment-content">{this.props.commentContent}</div>
      </div>
    );
  }
}

export default Comment;