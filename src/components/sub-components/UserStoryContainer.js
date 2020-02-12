import React from 'react';

import Comment from './Comment';
import parseDateTime from './../../utils/dateParser';
import { setPostPermissions } from './../../utils/permissionDefiner'

import './../../styles/user/user.story.container.css';

class UserStoryContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      commentText: '',
      comments: [],
      editText: '',
      isSubmitted: false
    }
  }

  componentDidMount() {
    this.getAllComments();
  }

  onCommentChange = (e) => {
    this.setState({
      commentText: e.target.value
    });
  }

  submitComment = (e) => {
    if (this.state.commentText) {
      this.props.onSubmit(e, this.state.commentText, this.props.postData.id)
        .then(commentList => {
          console.log('comment list: ', commentList);
          this.setState({
            commentText: '',
            comments: commentList
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
    else {
      e.preventDefault();
    }
  }

  getAllComments = () => {
    this.props.getCommentList(this.props.postData.id)
      .then(commentList => {
        console.log('list comments: ', commentList);
        this.setState({
          comments: commentList
        })
      })
      .catch(err => console.log(err));
  }

  handleCommentOptionClick = (data) => {
    this.props.onCommentOptionClick(data);
    this.setState({
      isSubmitted: false
    })
  }

  handlePostOptionClick = (e) => {
    let bodyRect = document.body.getBoundingClientRect();

    let { x, y } = document.getElementById(e.target.id).getBoundingClientRect();

    let popUpConfig = {
      type: 'post',
      buttonId: e.target.id,
      posX: parseInt(x - bodyRect.x),
      posY: parseInt(y - bodyRect.y),
      postId: this.props.postData.id,
      posterId: this.props.postData.userid,
      rights: setPostPermissions(this.props.userId, this.props.postData.userid)
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
      type: 'post',
      data: {
        postId: this.props.postData.id,
        newPostText: this.state.editText
      }
    });
    this.getAllComments();
  }

  handleCommentEditSubmit = (data) => {
    this.props.onEditSubmit(data)
      .then(commentList => {
        console.log('comment List: ', commentList);
        this.setState({
          comments: commentList,
          isSubmitted: true
        });
      })
      .catch(err => {
        console.log('comment edit error: ', err);
      });
  }

  handleCancelEdit = (e) => {
    e.preventDefault();
    this.props.onCancelEditClick();
    this.setState({
      editText: ''
    });
  }

  render() {

    return (
      <div className="user-story-container">

        <div className="post-head-wrapper">
          <div className="poster-title">
            <div className="poster-title-wrapper">
              <img src="userpic.png" alt="userpic"></img>
              <span className="poster-name">{this.props.postData.name}</span>
            </div>
            <div className="post-option-button" id={`post-option-button-${this.props.postData.id}`} onClick={this.handlePostOptionClick}>...</div>
          </div>
          <span className="post-date-time">{parseDateTime(this.props.postData.date_time)}</span>
        </div>



        <div className="post-body-wrapper">
          {this.props.postOnSelection && this.props.postOnSelection.type === 'post' ?
            <form className="post-edit-wrapper" onSubmit={this.handleEditSubmit}>
              <input className="post-edit-field" type="text" defaultValue={this.props.postData.content} onChange={this.handleEditChange}>
              </input>
              <a className="post-edit-cancel" href="/#" onClick={this.handleCancelEdit}>Cancel</a>
            </form> :
            <div className="user-story">{this.props.postData.content}</div>
          }

          <hr />
          <div className="comment-part-wrapper">
            <ul className="comment-list">
              {
                this.state.comments && this.state.comments.length > 0 ? this.state.comments.map((data, index) =>
                  <li key={data.id}>
                    <Comment userId={this.props.userId} postId={this.props.postData.id} posterId={this.props.postData.userid} commentData={data} commentOnSelection={data.id === this.props.postOnSelection.commentId && !this.state.isSubmitted ? this.props.postOnSelection : ''} onOptionClick={this.handleCommentOptionClick} onCancelEditClick={this.handleCancelEdit} onEditSubmit={this.handleCommentEditSubmit} />
                  </li>) : ''
              }
            </ul>
            <form className="comment-form" onSubmit={this.submitComment}>
              <input className="comment-field" type="text" placeholder="Write a comment..." onChange={this.onCommentChange} value={this.state.commentText}></input>
            </form>
          </div>
        </div>

      </div>
    )
  }
}

export default UserStoryContainer;