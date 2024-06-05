import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import PopUpMenu from './PopUpMenu';
import parseDateTime from '../utils/dateParser';
import { setCommentPermissions } from '../utils/permissionDefiner';

import './../styles/user/comment.css';

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
      isViewReplyClicked: false,
      popUpConfig: {
        rights: '',
        buttonId: '',
        postContainerId: '',
      },
    };
  }

  handleOptionClick = () => {
    this.props.onOptionClick(null, this.props.commentData.id);

    this.setState({
      popUpConfig: {
        rights: setCommentPermissions(
          this.props.userId,
          this.props.posterId,
          this.props.commentData.userid,
        ),
        buttonId: `comment-option-button-${this.props.commentData.id}`,
        postContainerId: `user-story-container-${this.props.postId}`,
      },
    });
  };

  handleOptionItemClick = (clickedItem) => {
    if (clickedItem === 'Edit') {
      return this.setState({ isEditClicked: true });
    }

    if (clickedItem === 'Delete') {
      this.setState({ isDeleteClicked: true });
    }
  };

  handleEditChange = (e) => {
    this.setState({ commentText: e.target.value });
  };

  handleEditSubmit = (e) => {
    e.preventDefault();

    this.props.onEditSubmit({
      type: 'comment',
      data: {
        postId: this.props.postId,
        commentId: this.props.commentData.id,
        newCommentText: this.state.commentText,
      },
    });

    this.setState({ isEditClicked: false });
  };

  handleCancelEdit = (e) => {
    e.preventDefault();

    this.setState({ isEditClicked: false });
  };

  handleDeleteOptionClick = (e, decision) => {
    e.preventDefault();

    if (decision === 'yes') {
      const commentData = {
        commentId: this.props.commentData.id,
        commentOwnerId: this.props.commentData.userid,
        postId: this.props.postId,
        postOwnerId: this.props.posterId,
      };
      this.props.onDeleteOptionClick(commentData);
    }

    this.setState({ isDeleteClicked: false });
  };

  handleReplyClick = (e) => {
    e.preventDefault();

    this.setState({ replyMode: true });
  };

  handleReplyChange = (e) => {
    this.setState({ replyText: e.target.value });
  };

  handleReplySubmit = (e) => {
    e.preventDefault();

    if (this.state.replyText) {
      const replyData = {
        text: this.state.replyText,
        parentPostId: this.props.postId,
        parentCommentId: this.props.commentData.id,
        parentCommentOwnerId: this.props.commentData.userid,
        postOwnerId: this.props.posterId,
      };

      this.props.onReplySubmit(replyData);
    }

    this.setState({
      replyText: '',
      replyMode: false,
    });
  };

  handleViewReplyClick = (e) => {
    e.preventDefault();

    this.setState({
      isViewReplyClicked: !this.state.isViewReplyClicked,
    });
  };

  handleCommentNameClick = (e) => {
    e.preventDefault();

    this.props.onCommentNameClick(this.props.commentData.userid);
  };

  render() {
    return (
      <Fragment>
        <div className="comment-container">
          <div className="comment-header">
            <div className="comment-content-wrapper">
              <span className="commenter-name">
                <Link
                  onClick={this.handleCommentNameClick}
                  to={`/user/user_${this.props.commentData.userid}`}
                >
                  {this.props.commentData.name}
                </Link>
              </span>
              {this.state.isEditClicked ? (
                <form
                  className="comment-edit-wrapper"
                  onSubmit={this.handleEditSubmit}
                >
                  <input
                    className="comment-edit-field"
                    type="text"
                    defaultValue={this.props.commentData.comment}
                    onChange={this.handleEditChange}
                    autoFocus
                  />
                  <a
                    className="comment-edit-cancel"
                    href="/#"
                    onClick={this.handleCancelEdit}
                  >
                    Cancel
                  </a>
                </form>
              ) : (
                <span className="comment-content">
                  {this.props.commentData.comment}
                </span>
              )}
            </div>
            <div className="comment-option-container">
              <div
                className="comment-option-button"
                onClick={this.handleOptionClick}
                id={`comment-option-button-${this.props.commentData.id}`}
              >
                ...
              </div>
            </div>
          </div>
          {this.state.isDeleteClicked ? (
            <span className="comment-delete-prompt">
              Delete this comment?&ensp;
              <a
                href="/#"
                onClick={(e) => this.handleDeleteOptionClick(e, 'yes')}
              >
                Yes
              </a>
              &ensp;|&ensp;
              <a
                href="/#"
                onClick={(e) => this.handleDeleteOptionClick(e, 'no')}
              >
                No
              </a>
            </span>
          ) : (
            ''
          )}
          <div>
            <span>
              <a
                className="comment-reply"
                href="/#"
                onClick={this.handleReplyClick}
              >
                - Reply
              </a>
              {this.props.commentData.replyList.length > 0 ? (
                <a
                  className="view-reply"
                  href="/#"
                  onClick={this.handleViewReplyClick}
                >
                  {this.state.isViewReplyClicked
                    ? '- Hide Replies'
                    : '- View Replies'}
                </a>
              ) : (
                ''
              )}
            </span>
            <span className="comment-time">
              {parseDateTime(
                this.props.commentData.date,
                this.props.commentData.time,
              )}
            </span>
          </div>
        </div>
        {this.props.isOptionClicked &&
        this.props.commentData.id === this.props.selectedCommentId ? (
          <PopUpMenu
            config={this.state.popUpConfig}
            onItemClick={this.handleOptionItemClick}
          />
        ) : (
          ''
        )}
        {this.state.replyMode ? (
          <form className="reply-form" onSubmit={this.handleReplySubmit}>
            <span className="current-user-name">{this.props.userName}</span>
            <input
              className="reply-field"
              type="text"
              placeholder="Write a reply..."
              onChange={this.handleReplyChange}
              autoFocus
            />
          </form>
        ) : (
          ''
        )}
        {this.props.commentData.replyList.length > 0 &&
        this.state.isViewReplyClicked ? (
          <ul className="replies">
            {this.props.commentData.replyList.map((reply) => (
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
                  onCommentNameClick={this.props.onCommentNameClick}
                />
              </li>
            ))}
          </ul>
        ) : (
          ''
        )}
      </Fragment>
    );
  }
}

Comment.propTypes = {
  onOptionClick: PropTypes.func,
  commentData: PropTypes.object,
  userId: PropTypes.string,
  posterId: PropTypes.string,
  onEditSubmit: PropTypes.func,
  onDeleteOptionClick: PropTypes.func,
  onReplySubmit: PropTypes.func,
  onCommentNameClick: PropTypes.func,
  userName: PropTypes.string,
  selectedCommentId: PropTypes.string,
  postId: PropTypes.string,
  isOptionClicked: PropTypes.func,
};

export default Comment;
