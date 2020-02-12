import React from 'react';

import { setCommentPermissions } from './../../utils/permissionDefiner';
import parseDateTime from './../../utils/dateParser';

import './../../styles/user/comment.css';

class Comment extends React.Component {

  constructor() {
    super();
    this.state = {
      editText: '',

    }
  }

  handleOptionClick = (e) => {
    let bodyRect = document.body.getBoundingClientRect();

    let { x, y } = document.getElementById(e.target.id).getBoundingClientRect();

    let popUpConfig = {
      type: 'comment',
      buttonId: e.target.id,
      posX: parseInt(x - bodyRect.x),
      posY: parseInt(y - bodyRect.y),
      commentId: this.props.commentData.id,
      commenterId: this.props.commentData.userid,
      postId: this.props.postId,
      posterId: this.props.posterId,
      rights: setCommentPermissions(this.props.userId, this.props.posterId, this.props.commentData.userid)
    }

    console.log('to pass obj: ', popUpConfig);

    this.props.onOptionClick(popUpConfig);
  }

  handleEditChange = (e) => {
    this.setState({
      editText: e.target.value
    });
  }

  handleEditSubmit = (e) => {
    e.preventDefault();
    this.props.onEditSubmit({
      type: 'comment',
      data: {
        postId: this.props.postId,
        commentId: this.props.commentData.id,
        newCommentText: this.state.editText
      }
    });
  }

  handleCancelEdit = (e) => {
    this.props.onCancelEditClick(e);
    this.setState({
      editText: ''
    });
  }

  render() {
    return (
      <div className="comment-container">
        <div className="comment-header">
          <div className="comment-content-wrapper">
            <span className="commenter-name">{this.props.commentData.name}</span> {this.props.commentOnSelection && this.props.commentOnSelection.commentId === this.props.commentData.id ?
              <form className="comment-edit-wrapper" onSubmit={this.handleEditSubmit}>
                <input className="comment-edit-field" type="text" defaultValue={this.props.commentData.comment} onChange={this.handleEditChange}>
                </input>
                <a className="comment-edit-cancel" href="/#" onClick={this.handleCancelEdit}>Cancel</a>
              </form> :
              <span className="comment-content">{this.props.commentData.comment}</span>
            }
          </div>
          <div className="comment-option-container" >
            <div className="comment-option-button" onClick={this.handleOptionClick} id={`comment-option-button-${this.props.commentData.id}`}>...</div>
          </div>
        </div>
        <div className="comment-time">{parseDateTime(this.props.commentData.date_time)}</div>

      </div>
    );
  }
}

export default Comment;