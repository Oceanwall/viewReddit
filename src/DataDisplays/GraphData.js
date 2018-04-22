import React, { Component } from 'react';
import {Bar} from 'react-chartjs-2';

class GraphData extends Component {
  constructor(props) {
    super(props);
    let dataForGraph = this.prepareData(props.topWords);
    this.state = {
      topWords: props.topWords,
      dataForGraph: dataForGraph,
    };
  }

  /* CURRENT PROBLEMS:
  Graph data is not showing up
  Graph data is one iteration behind
  Graph scale is wrong (possibly related to problem 1)
  Graph width is messed up

  TODO: Maybe look into a different graph depictor?
        Maybe try to make a native HTML graph?
        Note: If not using reach-chartjs-2, be sure to remove those dependencies
        (use depcheck or npm-check)
        */

  prepareData(topWords) {
    //for now, let's only graph the first 5 words or so.
    //this can probably be efficientized, but i'll figure that out later
    let targetWords = topWords.length > 5 ? 5 : topWords.length;
    let graphLabels = [];
    let graphData = [];

    for (let i = 0; i < targetWords; i++) {
      let currentWord = topWords[i];
      graphLabels.push(currentWord.word);
      graphData.push(currentWord.frequency);
    }

    let dataForGraph = {
      labels: graphLabels,
      dataSets: [
        {
          label: "Word Frequency Graph",
          backgroundColor: 'rgba(255,99,132,0.2)',
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
          hoverBorderColor: 'rgba(255,99,132,1)',
          data: graphData,
        }
      ],
    };

    return dataForGraph;
  }

  render() {
    return(
      <Bar
        data={this.state.dataForGraph}
        width={100}
        height={50}
        options={{
          maintainAspectRatio: true
        }}
      />
    );
  }
}

export default GraphData;
