import React, { Component } from 'react';
import TableElement from './TableElement.js';

class TableData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCommentData: props.showCommentData,
      wordMap: props.wordMap,
      wordsAnalyzed: props.wordsAnalyzed,
      commentsAnalyzed: props.commentsAnalyzed,
      table: [],
    }
  }

  //i am a dumb dumb and forgot about this method :() AHHHHH
  componentDidMount() {
    this.sortTable();
  }

  sortTable() {
    let wordMapArray = [];
    let i = 0;

    for (let [key, value] of this.state.wordMap) {
      wordMapArray[i] = {word: key, frequency: value, relativeFrequency: (value / this.state.wordsAnalyzed).toFixed(5)};
      i++;
    }

    wordMapArray.sort((a, b) => {
      return b.frequency - a.frequency;
    });

    this.prepareTable(wordMapArray);
  }

  prepareTable(wordMapArray) {
    let tableElementArray = [];

    for (let i = 0; i < wordMapArray.length; i++) {
      let element = wordMapArray[i];
      tableElementArray[i] = <TableElement
        word={element.word}
        frequency={element.frequency}
        relativeFrequency={element.relativeFrequency}
        key={i}/>;
    }

    this.setState({table: tableElementArray});
  }

  render() {
    return (
      <table className="leftSide dataBody">
        <tr>
          <th className="word">Word</th>
          <th className="freq">Frequency</th>
          <th className="relFreq">Relative Frequency</th>
        </tr>
        <tbody>
          {this.state.table}
        </tbody>
      </table>
    );
  }
}
export default TableData;
