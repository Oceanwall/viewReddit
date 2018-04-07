import React from 'react';

function BackButton(props) {
  return (
    <button onClick={props.back} className="submit back">
      {props.text}
    </button>
  );
}

export default BackButton;
