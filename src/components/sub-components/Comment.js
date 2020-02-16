import React, { Fragment } from 'react';

import { setCommentPermissions } from './../../utils/permissionDefiner';
import parseDateTime from './../../utils/dateParser';
import PopUpMenu from './../PopUpMenu';

import './../../styles/user/comment.css';

class Comment extends React.Component {

  constructor() {
    super();
    this.state = {
      commentText: '',
      replyText: '',
      replyMode: false,
      isSubmitted: false,
      isEditClicked: false,
      isDeleteClicked: false,
      popUpConfig: {
        rights: '',
        buttonId: '',
        postContainerId: ''
      }
    }
  }

  handleOptionClick = (e) => {
    this.props.onOptionClick(null, this.props.commentData.id);
    this.setState({
      popUpConfig: {
        rights: setCommentPermissions(this.props.userId, this.props.posterId, this.props.commentData.userid),
        buttonId: `comment-option-button-${this.props.commentData.id}`,
        postContainerId: `user-story-container-${this.props.postId}`
      }
    });
  }

  handleOptionItemClick = (clickedItem) => {
    if (clickedItem === 'Edit') {
      this.setState({
        isEditClicked: true
      })
    }
    else if (clickedItem === 'Delete') {
      this.setState({
        isDeleteClicked: true
      })
    }
  }

  handleEditChange = (e) => {
    this.setState({
      commentText: e.target.value
    });
  }

  handleEditSubmit = (e) => {
    e.preventDefault();
    this.props.onEditSubmit({
      type: 'comment',
      data: {
        postId: this.props.postId,
        commentId: this.props.commentData.id,
        newCommentText: this.state.commentText
      }
    });
    this.setState({
      isEditClicked: false
    })
  }

  handleCancelEdit = (e) => {
    e.preventDefault();
    this.setState({
      isEditClicked: false
    })
  }

  handleDeleteOptionClick = (e, decision) => {
    e.preventDefault();
    if (decision === 'yes') {
      const commentData = {
        commentId: this.props.commentData.id,
        commentOwnerId: this.props.commentData.userid,
        postId: this.props.postId,
        postOwnerId: this.props.posterId
      }
      this.props.onDeleteOptionClick(commentData);
    }

    this.setState({
      isDeleteClicked: false
    })
  }

  handleReplyClick = (e) => {
    e.preventDefault();
    this.setState({
      replyMode: true
    });
  }

  handleReplyChange = (e) => {
    this.setState({
      replyText: e.target.value
    })
  }

  handleReplySubmit = (e) => {
    e.preventDefault();
    if (this.state.replyText) {
      const replyData = {
        text: this.state.replyText,
        parentPostId: this.props.postId,
        parentCommentId: this.props.commentData.id,
      }

      this.props.onReplySubmit(replyData);
    }
    this.setState({
      replyText: '',
      replyMode: false
    })
  }

  render() {
    return (
      <Fragment>
        <div className="comment-container">
          <div className="comment-header">
            <div className="comment-content-wrapper">
              <span className="commenter-name">{this.props.commentData.name}</span>
              {
                this.state.isEditClicked ?
                  <form className="comment-edit-wrapper" onSubmit={this.handleEditSubmit}>
                    <input className="comment-edit-field" type="text" defaultValue={this.props.commentData.comment} onChange={this.handleEditChange} autoFocus>
                    </input>
                    <a className="comment-edit-cancel" href="/#" onClick={this.handleCancelEdit}>Cancel</a>
                  </form> :
                  <span className="comment-content">{this.props.commentData.comment}</span>
              }
            </div>
            <div className="comment-option-container" >
              <div className="comment-option-button"
                onClick={this.handleOptionClick}
                id={`comment-option-button-${this.props.commentData.id}`}>
                ...
              </div>
            </div>
          </div>
          {
            this.state.isDeleteClicked ?
              <span className="comment-delete-prompt" >
                Delete this comment?
                <a href="/#" onClick={(e) => this.handleDeleteOptionClick(e, 'yes')}>
                  Yes
                </a> |
                <a href="/#" onClick={(e) => this.handleDeleteOptionClick(e, 'no')} >
                  No
                </a>
              </span> :
              ''
          }
          <div>
            <span className="comment-time">
              {parseDateTime(this.props.commentData.date_time)}
            </span>
            <a className="comment-reply" href="/#" onClick={this.handleReplyClick}>Reply</a>
          </div>

        </div>
        {this.props.isOptionClicked && this.props.commentData.id === this.props.selectedCommentId ? <PopUpMenu config={this.state.popUpConfig} onItemClick={this.handleOptionItemClick} /> : ''}
        {
          this.state.replyMode ?
            <form className="reply-form" onSubmit={this.handleReplySubmit}>
              <span className="current-user-name">{this.props.userName}</span>
              <input
                className="reply-field" type="text" placeholder="Write a reply..." onChange={this.handleReplyChange} autoFocus>
              </input>
            </form> :
            ''
        }
        {
          this.props.commentData.replyList ?
            <ul className="replies">
              {
                this.props.commentData.replyList.map((reply, index) =>
                  <li key={reply.id}>
                    <Comment
                      userId={this.props.userId}
                      userName={this.props.userName}
                      postId={this.props.postId}
                      posterId={this.props.posterId}
                      commentData={reply}
                      isOptionClicked={this.props.isOptionClicked}
                      selectedCommentId={this.props.selectedCommentId}
                      onOptionClick={this.props.onOptionClick}
                      onReplySubmit={this.props.onReplySubmit}
                      onEditSubmit={this.props.onEditSubmit}
                      onDeleteOptionClick={this.props.onDeleteOptionClick}
                    />
                  </li>
                )
              }
            </ul> :
            ''
        }
      </Fragment>
    );
  }
}

export default Comment;