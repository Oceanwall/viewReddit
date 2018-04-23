import React, { Component } from 'react';
import {Bar} from 'react-chartjs-2';

class GraphData extends Component {
  constructor(props) {
    super(props);
    let dataForGraph = this.prepareData(props.topWords).then((result) => {
      return result;
    });
    this.state = {
      topWords: props.topWords,
      dataForGraph: dataForGraph,
    }
    console.log(this.state.dataForGraph);
  }

  /* CURRENT PROBLEMS:
  Graph data is one iteration behind
  Graph width is messed up
  returning promise? hmmm :///
  */

  prepareData(topWords) {
    //for now, let's only graph the first 5 words or so.
    //this can probably be efficientized, but i'll figure that out later
    return new Promise(function(resolve, reject) {
      let targetWords = topWords.length > 5 ? 5 : topWords.length;
      let graphLabels = [];
      let graphData = [];

      for (let i = 0; i < targetWords; i++) {
        let currentWord = topWords[i];
        graphLabels[i] = currentWord.word;
        graphData[i] = currentWord.frequency;
      }

      //graph now appears! yippee
      let dataForGraph = {
        labels: graphLabels,
        datasets: [
          {
            label: 'Frequency',
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: graphData,
          }
        ]
      };
      console.log(1);
      resolve(dataForGraph);
    });
  }

  render() {
    if (this.state == null) {
      return null;
    }
    return(
      <Bar
        data={this.state.dataForGraph}
        width={100}
        height={50}
        options={{
          legend: {
            display: false
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          },
          maintainAspectRatio: false
        }}
      />
    );
  }
}

export default GraphData;
