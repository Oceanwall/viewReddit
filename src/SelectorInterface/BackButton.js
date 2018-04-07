import React from 'react';

//Handles the "GO BACK" buttons for the loading screen and the Selected interfaces
function BackButton(props) {
  return (
    <button onClick={props.back} className="submit back">
      {props.text}
    </button>
  );
}

export default BackButton;
