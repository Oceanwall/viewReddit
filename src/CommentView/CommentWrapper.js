import React, { Component } from 'react';
import swal from 'sweetalert';
import { CSSTransitionGroup } from 'react-transition-group';
import Comment from "./Comment.js";

//Wrapper class for CSSTransitionGroup and Comment
class CommentWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
      body: props.comment.body,
      comment: props.comment,
      commentClass: props.commentClass,
    }

    this.showCommentData = this.showCommentData.bind(this);
  }

  showCommentData() {
    let author = this.state.comment.author.name;
    let permalink = "https://www.reddit.com" + this.state.comment.permalink;
    console.log(permalink);
    swal({
      title: "Comment Details",
      text: "This comment was written by /u/" + author + ".\n\nClick the Show Me! button below to navigate to the comment on Reddit.",
      icon: "info",
      button: "Show Me!"
    }).then((showMe) => {
      if (showMe) {
        window.open(permalink, '_blank');
      }
    });
  }

  render() {
    return (
      <div id={this.state.location} onClick={this.showCommentData}>
        <CSSTransitionGroup
          transitionName="transition"
          transitionAppear={true}
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500} >
          <Comment
            body={this.state.body}
            commentClass={this.state.commentClass}
          />
        </CSSTransitionGroup>
      </div>
    );
  }
}

export default CommentWrapper
