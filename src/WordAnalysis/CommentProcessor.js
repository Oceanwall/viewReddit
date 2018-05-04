import React, { Component } from 'react';
import swal from 'sweetalert';
import { processWord } from './WordProcessor.js';
import WorkerButton from '../AppControl/WorkerButton.js';
import { DO_NOT_PROCESS } from './WordAnalysisConstants.js';
var XLSX = require('xlsx');

var storageMap;
var wordsAnalyzed;
var commentsAnalyzed;

//Provides relevant buttons to offer varied features and functionalities
//Processes comments, recording their word usage and frequencies, to produce word data
//Produces the excel file of word data when prompted
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

    //Not part of state; much more efficient this way
    storageMap = new Map();
    wordsAnalyzed = 0;
    commentsAnalyzed = 0;

    this.prepareData = this.prepareData.bind(this);
    this.resetData = this.resetData.bind(this);
    this.downloadData = this.downloadData.bind(this);
  }

  //Takes in new comments and determines if buttons should be shown or hidden
  componentWillReceiveProps(nextProps) {
    //There is no need to save the current comment.
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

  //Processes new comments to extract their words
  processComment(comment) {
    //Should be comment.author.name, but uses shavedComment
    if (comment.author !== "AutoModerator") {
        commentsAnalyzed++;
        //Spaces are used to differentiate between words
        let index = comment.body.indexOf(" ");

        while (index !== -1) {
          //processWord normalizes the word and knocks off any extraneous stuff (recursive function)
          let cleanedWord = processWord(comment.body.substring(0, index).toLowerCase());

          //if the word isn't empty (i.e "")
          if (cleanedWord !== DO_NOT_PROCESS) {
            wordsAnalyzed++;
            let result = storageMap.get(cleanedWord);

            if (result === undefined) {
              storageMap.set(cleanedWord, 1);
            }
            else {
              storageMap.set(cleanedWord, result + 1);
            }
          }
          //Go back for the next word
          comment.body = comment.body.substring(index + 1);
          index = comment.body.indexOf(" ");
        }
      }
  }

  //Sends data to the main application state in preparation to produce table and graph data depictions
  //Also hides relevant buttons
  prepareData() {
    this.state.transferViews(storageMap, wordsAnalyzed, commentsAnalyzed);
    this.setState({dataButtonClass: "submit back disappear", resetDataClass: "submit back disappear", excelDataClass: "submit back"});
  }

  //Creates the excel file to download
  downloadData() {
    //Format should be an array of arrays, where each array represents a row
    let wordMapArray = [];
    let excelDataArray = [];
    let subredditNameOnly = this.state.subredditName.slice(3, -1);
    let fileName = subredditNameOnly+ ".xlsx";
    let workSheetName = subredditNameOnly + " Data";
    let i = 0;

    //Create the wordMapArray from the current storageMap
    for (let [key, value] of storageMap) {
      wordMapArray[i] = {word: key, frequency: value, relativeFrequency: (value / wordsAnalyzed).toFixed(5)};
      i++;
    }

    wordMapArray.sort((a, b) => {
      return b.frequency - a.frequency;
    });

    //Sort it, and then add each individual entry
    excelDataArray.push(["Word", "Frequency", "Relative Frequency"]);
    for (let i = 0; i < wordMapArray.length; i++) {
      let wordObject = wordMapArray[i];
      excelDataArray.push([wordObject.word, wordObject.frequency, wordObject.relativeFrequency]);
    }

    //Create the excel file here with XLSX
    let workBook = XLSX.utils.book_new();
    let workSheet = XLSX.utils.aoa_to_sheet(excelDataArray);
    XLSX.utils.book_append_sheet(workBook, workSheet, workSheetName);
    XLSX.writeFile(workBook, fileName);
  }

  //Resets the collected data; also provides warning in case if accidentally clicked
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
