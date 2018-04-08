import React from 'react';

function TableElement(props) {
  return (
    <tr>
      <td className="word">{props.word}</td>
      <td className="freq">{props.frequency}</td>
      <td className="relFreq">{props.relativeFrequency}</td>
    </tr>
  );
}

export default TableElement;
