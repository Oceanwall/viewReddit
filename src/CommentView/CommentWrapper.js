import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import Comment from "./Comment.js";

//Wrapper class for CSSTransitionGroup and Comment
function CommentWrapper(props) {
  return (
    <div id={props.location}>
      <CSSTransitionGroup
        transitionName="transition"
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500} >
        <Comment
          body={props.body}
          commentClass={props.commentClass}
        />
      </CSSTransitionGroup>
    </div>
  );
}

export default CommentWrapper
