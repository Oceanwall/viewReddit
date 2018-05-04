import React, { Component } from 'react';
import TableElement from './TableElement.js';

//Displays the frequencies of the top 500 words in tabular form
class TableData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCommentData: props.showCommentData,
      wordMap: props.wordMap,
      wordsAnalyzed: props.wordsAnalyzed,
      commentsAnalyzed: props.commentsAnalyzed,
      getTop500: props.getTop500,
      table: [],
    }
  }

  //Sorts table after component has been rendered (avoids pre-render state update error)
  componentDidMount() {
    this.sortTable();
  }

  //Sorts the table to get the words in frequency order (from most frequent to least)
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

  //Takes the top 500 most frequent words, and enters them into the table
  prepareTable(wordMapArray) {
    let tableElementArray = [];
    let topWordArray = [];

    let tableLength = wordMapArray.length > 500 ? 500 : wordMapArray.length;

    for (let i = 0; i < tableLength; i++) {
      let element = wordMapArray[i];
      topWordArray[i] = element;
      tableElementArray[i] = <TableElement
        word={element.word}
        frequency={element.frequency}
        relativeFrequency={element.relativeFrequency}
        key={i}/>;
    }

    this.state.getTop500(topWordArray);
    this.setState({table: tableElementArray});
  }

  render() {
    return (
      <table className="leftSide dataBody">
        <tbody>
          <tr>
            <th className="word">Word</th>
            <th className="freq">Frequency</th>
            <th className="relFreq">Relative Frequency</th>
          </tr>
          {this.state.table}
        </tbody>
      </table>
    );
  }
}
export default TableData;
