import React from 'react';
import { Link } from 'react-router-dom';

import Comment from './Comment';
import parseDateTime from '../utils/dateParser';
import PopUpMenu from './PopUpMenu';
import { setPostPermissions } from '../utils/permissionDefiner';
import { localhost } from '../constants/config';

import './../styles/user/user.story.container.css';

class UserStoryContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      commentText: '',
      comments: [],
      postText: '',
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

  componentDidMount() {
    this.getAllComments();
  }

  getAllComments = () => {
    this.props.getCommentList(this.props.postData.id)
      .then(commentList => {
        this.setState({
          comments: commentList
        })
      })
      .catch(err => console.log('get all comments error: ', err));
  }

  handleCommentChange = (e) => {
    this.setState({
      commentText: e.target.value
    });
  }

  handleCommentSubmit = (e) => {
    e.preventDefault();
    if (this.state.commentText) {
      const commentData = {
        text: this.state.commentText,
        parentPostId: this.props.postData.id,
        parentCommentId: '',
        postOwnerId: this.props.postData.userid
      }
      this.props.onCommentSubmit(commentData)
        .then(commentList => {
          this.setState({
            commentText: '',
            comments: commentList
          });
        })
        .catch(err => {
          console.log('comment submit error: ', err);
        });
    }
  }

  handleOptionClick = (e) => {
    this.props.onOptionClick(this.props.postData.id, null);
    this.setState({
      popUpConfig: {
        rights: setPostPermissions(this.props.userId, this.props.postData.userid),
        buttonId: `post-option-button-${this.props.postData.id}`,
        postContainerId: `user-story-container-${this.props.postData.id}`
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
      postText: e.target.value
    });
  }

  handleEditSubmit = (e) => {
    e.preventDefault();
    this.props.onEditSubmit({
      type: 'post',
      data: {
        postId: this.props.postData.id,
        newPostText: this.state.postText ? this.state.postText : this.props.postData.content
      }
    });
    this.getAllComments();
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
      const postData = {
        postId: this.props.postData.id,
        postOwnerData: this.props.postData.userid
      }
      this.props.onPostDelete(postData);
    }
    else if (decision === 'no') {

    }
    this.setState({
      isDeleteClicked: false
    })
  }

  handleCommentEditSubmit = (commentData) => {
    this.props.onEditSubmit(commentData)
      .then(commentList => {
        this.setState({
          comments: commentList,
          isSubmitted: true
        });
      })
      .catch(err => {
        console.log('comment edit error: ', err);
      });
  }

  handleCommentDeleteClick = (commentData) => {
    this.props.onCommentDelete(commentData)
      .then(commentList => {
        this.setState({
          comments: commentList
        });
      })
      .catch(err => {
        console.log('comment edit error: ', err);
      });
  }

  handleReplySubmit = (replyData) => {
    this.props.onCommentSubmit(replyData)
      .then(commentList => {
        this.setState({
          comments: commentList
        });
      })
      .catch(err => {
        console.log('comment submit error: ', err);
      });
  }

  handlePostNameClick = (e) => {
    e.preventDefault();
    this.props.onProfileNameClick(this.props.postData.userid);
  }

  render() {

    return (
      <div className="user-story-container" id={`user-story-container-${this.props.postData.id}`}>

        <div className="post-head-wrapper">
          <div className="poster-title">
            <div className="poster-title-wrapper">
              <img src={`http://${localhost}:3000/userpic.png`} alt="userpic"></img>
              <span className="poster-name"><Link to={`/user/user_${this.props.postData.userid}`} onClick={this.handlePostNameClick}>{this.props.postData.name}</Link></span>
            </div>
            <div className="post-option-button" id={`post-option-button-${this.props.postData.id}`} onClick={this.handleOptionClick}>...</div>
          </div>
          <span className="post-date-time">{parseDateTime(this.props.postData.date, this.props.postData.time)}</span>
        </div>

        <div className="post-body-wrapper">
          {this.state.isEditClicked ?
            <form className="post-edit-wrapper" onSubmit={this.handleEditSubmit}>
              <textarea className="post-edit-field" type="text" defaultValue={this.props.postData.content} onChange={this.handleEditChange} autoFocus>
              </textarea>
              <div className="post-eidt-decision-wrapper">
                <input className="post-edit-submit-button" type="submit" value="Save"></input>
                <a className="post-edit-cancel" href="/#" onClick={this.handleCancelEdit}>Cancel</a>
              </div>
            </form> :
            <div className="user-story">{this.props.postData.content}</div>
          }
          {
            this.state.isDeleteClicked ?
              <span className="post-delete-prompt" >
                Delete this post?
                <a href="/#" onClick={(e) => this.handleDeleteOptionClick(e, 'yes')}>
                  Yes
                </a> |
                <a href="/#" onClick={(e) => this.handleDeleteOptionClick(e, 'no')} >
                  No
                </a>
              </span> :
              ''
          }

          <div className="comment-part-wrapper">
            <ul className="comment-list">
              {
                this.state.comments && this.state.comments.length > 0 ? this.state.comments.map((data, index) =>
                  <li key={data.id}>
                    <Comment
                      userId={this.props.userId}
                      userName={this.props.userName}
                      postId={this.props.postData.id}
                      posterId={this.props.postData.userid}
                      commentData={data}
                      isOptionClicked={this.props.isOptionClicked}
                      selectedCommentId={this.props.selectedCommentId}
                      onOptionClick={this.props.onOptionClick}
                      onReplySubmit={this.handleReplySubmit}
                      onEditSubmit={this.handleCommentEditSubmit}
                      onDeleteOptionClick={this.handleCommentDeleteClick}
                      onCommentNameClick={this.props.onProfileNameClick}
                    />
                  </li>) :
                  ''
              }
            </ul>
            <form className="comment-form" onSubmit={this.handleCommentSubmit}>
              <span className="current-user-name">{this.props.userName}</span>
              <input className="comment-field" type="text" placeholder="Write a comment..." value={this.state.commentText} onChange={this.handleCommentChange} ></input>
            </form>
          </div>
        </div>

        {this.props.isOptionClicked && this.props.postData.id === this.props.selectedPostId ? <PopUpMenu config={this.state.popUpConfig} onItemClick={this.handleOptionItemClick} /> : ''}
      </div >

    )
  }
}

export default UserStoryContainer;