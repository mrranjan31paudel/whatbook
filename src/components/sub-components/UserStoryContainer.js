import React from 'react';

import Comment from './Comment';
import parseDateTime from '../../utils/dateParser';

import './../../styles/user/user.story.container.css';

class Userstorycontainer extends React.Component {
  constructor() {
    super();
    this.state = {
      commentText: '',
      comments: []
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
    this.props.onSubmit(e, this.state.commentText, this.props.postId)
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

  getAllComments = () => {
    this.props.getCommentList(this.props.postId)
      .then(commentList => {
        console.log('list comments: ', commentList);
        this.setState({
          comments: commentList
        })
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="user-story-container">
        <div className="poster-title">
          <img src="userpic.png" alt="userpic"></img>
          <span className="poster-name">{this.props.userName}</span>
        </div>
        <span className="post-date-time">{this.props.dateTime}</span>
        <div className="user-story">{this.props.userStory}</div>
        <hr />
        <ul className="comment-list">
          {
            this.state.comments && this.state.comments.length > 0 ? this.state.comments.map((data, index) =>
              <li key={data.id}>
                <Comment commenterName={data.name} commentTime={parseDateTime(data.date_time)} commentContent={data.comment} />
              </li>) : ''
          }
        </ul>
        <form className="comment-form" onSubmit={this.submitComment}>
          <input className="comment-field" type="text" placeholder="Write a comment..." onChange={this.onCommentChange} value={this.state.commentText}></input>
        </form>
      </div>
    )
  }
}

export default Userstorycontainer;