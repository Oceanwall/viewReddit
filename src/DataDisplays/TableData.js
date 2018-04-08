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
    this.prepareTable();
  }

  prepareTable() {
    let tableElementArray = [];
    let i = 0;

    for (let [key, value] of this.state.wordMap) {
      tableElementArray[i] = <TableElement word={key} frequency={value} key={i}/>
      i++;
    }

    this.setState({table: tableElementArray});
  }

  render() {
    return (
      <div className="leftside">
        <table>
          <tbody>
            <tr>
              <th>Word</th>
              <th>Frequency</th>
            </tr>
            {this.state.table}
          </tbody>
        </table>
      </div>
    );
  }
}
export default TableData;
