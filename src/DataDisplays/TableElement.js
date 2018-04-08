import React from 'react';

function TableElement(props) {
  return (
    <tr>
      <td>{props.word}</td>
      <td>{props.frequency}</td>
    </tr>
  );
}

export default TableElement;
