import React, { Component } from 'react';
import CommentWrapper from './CommentWrapper.js';
import classNames from 'classnames';

//Shows the comments once a snoostream connection has been made and comments have been obtained
class CommentView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stream: props.stream,
      comments: [],
      index: 0,
      filledOnce: false,
      loading: props.loading,
      onFirstComment: props.onFirstComment,
      transferComment: props.transferComment,
      showCommentData: false,
      currentClass: "fill",
    }
    this.showComments(); //kicks off comment collection
  }

  componentWillReceiveProps(nextProps) {
    this.setState({showCommentData: nextProps.showCommentData});
    if (nextProps.showCommentData === true && this.state.showCommentData === false) {
      let hiddenClass = "fill hide";
      this.setState({currentClass: hiddenClass});
    }
    else if (nextProps.showCommentData === false && this.state.showCommentData === true) {
      let showClass = "fill";
      this.setState({currentClass: showClass});
    }
  }

  //Takes in the stream's comments, audits them for length, and formats them before displaying them.
  //Also controls when the loading screen ends
  showComments() {
    this.state.stream.on("comment", (comment) => {

      let shavedComment = {body: comment.body, author: comment.author.name}
      this.state.transferComment(shavedComment);

      //Comment length must be between 50 and 150 chararcters
      if (comment.body.length < 150 && comment.body.length > 50) {
        console.log("mellow world");
        let newCommentArray = this.state.comments.slice();

        //Ends loading screen
        if (this.state.loading) {
          this.state.onFirstComment();
        }

        //Random formatting for comments
        let randomFormatNumber1 = Math.floor((Math.random() * 4) + 1);
        let randomFormatNumber2 = Math.floor((Math.random() * 4) + 1);

        let commentClass = classNames({
          "classyAppearance": true,
          [`color${randomFormatNumber1}`]: true,
          [`font${randomFormatNumber2}`]: true,
        });
        let divLocation = `location${this.state.index}`;

        //Removal of old comments allows for enter and leave transitions
        if (this.state.filledOnce) {
          newCommentArray[this.state.index] = null;
          this.setState({comments: newCommentArray});
        }

        //Wrapper is necessary to hold both Comment and CSSTransitionGroup
        let newComment = <CommentWrapper
          location={divLocation}
          commentClass={commentClass}
          body={comment.body}
          key={this.state.index}
        />
        newCommentArray[this.state.index] = newComment;

        let newIndex = (this.state.index + 1) % 16;
        if (newIndex === 0 && this.state.filledOnce === false) {
          this.setState({filledOnce: true});
        }
        this.setState({comments: newCommentArray, index: newIndex});
      }
    });
  }

  //Renders the array of comments
  render() {
    return (
      <div className={this.state.currentClass}>
        {this.state.comments}
      </div>
    )
  }
}

export default CommentView;
