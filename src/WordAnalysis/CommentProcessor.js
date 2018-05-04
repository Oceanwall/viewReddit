import React, { Component } from 'react';
import swal from 'sweetalert';
import { processWord } from './WordProcessor.js';
import WorkerButton from '../AppControl/WorkerButton.js';
import { DO_NOT_PROCESS } from './WordAnalysisConstants.js';
var XLSX = require('xlsx');

var storageMap;
var wordsAnalyzed;
var commentsAnalyzed;

class CommentProcessor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subredditName: props.subredditName,
      currentComment: props.currentComment,
      transferViews: props.transferViews,
      resetData: props.resetData,
      dataButtonClass: "submit back",
      resetDataClass: "submit back",
      excelDataClass: "submit back disappear",
      showCommentData: props.showCommentData,
      hide: true,
    }

    storageMap = new Map();
    wordsAnalyzed = 0;
    commentsAnalyzed = 0;

    this.prepareData = this.prepareData.bind(this);
    this.resetData = this.resetData.bind(this);
    this.downloadData = this.downloadData.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    //There is no need to save the current comment?
    this.processComment(nextProps.currentComment);
    this.setState({showCommentData: nextProps.showCommentData});
    if (nextProps.showCommentData === false && this.state.showCommentData === true) {
      this.setState({dataButtonClass: "submit back", resetDataClass: "submit back", excelDataClass: "submit back disappear"});
    }
    if (wordsAnalyzed > 50) {
      this.setState({hide: false});
    } else {
      this.setState({hide: true});
    }
  }

  processComment(comment) {
    //should be comment.author.name, but im using shavedComment
    if (comment.author !== "AutoModerator") {
        commentsAnalyzed++;
        let index = comment.body.indexOf(" "); //spaces are used to differentiate between words

        while (index !== -1) {
          let cleanedWord = processWord(comment.body.substring(0, index).toLowerCase()); //processWord normalizes the word and knocks off any extraneous stuff (recursive function)

          if (cleanedWord !== DO_NOT_PROCESS) { //if the word isn't empty (i.e "")

            wordsAnalyzed++;
            let result = storageMap.get(cleanedWord);

            if (result === undefined) {
              storageMap.set(cleanedWord, 1);
            }
            else {
              storageMap.set(cleanedWord, result + 1);
            }

          }

          comment.body = comment.body.substring(index + 1);
          index = comment.body.indexOf(" ");
        }
      }
  }

  prepareData() {
    this.state.transferViews(storageMap, wordsAnalyzed, commentsAnalyzed);
    //also, can this function be merged with onClick. test later...
    this.setState({dataButtonClass: "submit back disappear", resetDataClass: "submit back disappear", excelDataClass: "submit back"});
  }

  downloadData() {
    //format should be an array of arrays, where each array represents a row
    let wordMapArray = [];
    let excelDataArray = [];
    let subredditNameOnly = this.state.subredditName.slice(3, -1);
    let fileName = subredditNameOnly+ ".xlsx";
    let workSheetName = subredditNameOnly + " Data";
    let i = 0;

    for (let [key, value] of storageMap) {
      wordMapArray[i] = {word: key, frequency: value, relativeFrequency: (value / wordsAnalyzed).toFixed(5)};
      i++;
    }

    wordMapArray.sort((a, b) => {
      return b.frequency - a.frequency;
    });

    excelDataArray.push(["Word", "Frequency", "Relative Frequency"]);
    for (let i = 0; i < wordMapArray.length; i++) {
      let wordObject = wordMapArray[i];
      excelDataArray.push([wordObject.word, wordObject.frequency, wordObject.relativeFrequency]);
    }

    let workBook = XLSX.utils.book_new();
    let workSheet = XLSX.utils.aoa_to_sheet(excelDataArray);
    XLSX.utils.book_append_sheet(workBook, workSheet, workSheetName);
    XLSX.writeFile(workBook, fileName);
  }

  resetData() {
    swal({
      title: "Are you sure?",
      text: "Data cannot be recovered once the reset is complete.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((wantDelete) => {
      if (wantDelete) {
        storageMap = new Map();
        wordsAnalyzed = 0;
        commentsAnalyzed = 0;
        this.state.resetData(storageMap, wordsAnalyzed, commentsAnalyzed);
        swal({
          title: "Data Successfully Reset!",
          text: "",
          icon: "success",
          button: "Awesome!"
        });
      }
    });
  }

  render() {
    //use of span here is really helpful; preserves the in-lineness of the buttons
    //also, im being slightly lazy here by using span className to hide the button when pressed :)
    return(
      <span>
        <WorkerButton
          className={this.state.dataButtonClass}
          click={this.prepareData}
          hide={this.state.hide}
          text="SEE DATA"
        />
        <WorkerButton
          className={this.state.resetDataClass}
          click={this.resetData}
          text="RESET DATA"
        />
        <WorkerButton
          className={this.state.excelDataClass}
          click={this.downloadData}
          text="DOWNLOAD DATA"
        />
      </span>
    );
  }
}

export default CommentProcessor;
