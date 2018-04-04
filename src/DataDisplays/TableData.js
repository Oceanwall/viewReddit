import React, { Component } from 'react';

class TableData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wordMap: props.wordMap,
      wordsAnalyzed: props.wordsAnalyzed,
      commentsAnalyzed: props.commentsAnalyzed,
    }
  }

  render() {
    return (
      <div>
        <div>{this.state.wordsAnalyzed}</div>
        <div>{this.state.commentsAnalyzed}</div>
      </div>
    )
  }
}
export default TableData;
