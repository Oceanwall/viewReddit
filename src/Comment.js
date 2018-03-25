import React from 'react';

//Creates raw comment, with styling and content
function Comment(props) {
  return (
    <div className={props.commentClass}>
      {props.body}
    </div>
  );
}

export default Comment;
