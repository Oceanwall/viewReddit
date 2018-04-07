//words analyzed and storage map should be props passed down from app.js
//this component handles tracking, etc; another component will handle display?
//how do i shove live comments into this bad boy of a component?
//ANSWER: to pass between siblings, must use parent as intermediary
//maybe have prop comment; when that gets updated, call the processComment function on it? no need to actually update state?
//one ufnction here (switch views) and another function for the other component (reset?)
//Do I hide this behind a button?
import React, { Component } from 'react';
import { processWord } from './WordProcessor.js';
import WorkerButton from '../AppControl/WorkerButton.js';
import { DO_NOT_PROCESS } from './WordAnalysisConstants.js';

var storageMap;
var wordsAnalyzed;
var commentsAnalyzed;

class CommentProcessor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentComment: props.currentComment,
      transferViews: props.transferViews,
      resetData: props.resetData,
      dataButtonClass: "submit back",
      resetDataClass: "submit back",
      showCommentData: props.showCommentData,
    }
    // console.log(this.state.transferViews);

    storageMap = new Map();
    wordsAnalyzed = 0;
    commentsAnalyzed = 0;

    this.prepareData = this.prepareData.bind(this);
    this.resetData = this.resetData.bind(this);
  }

//TODO: reset data collection (give user feedback to indicate that data has been reset?) (maybe integrate jquery to avoid using setTimeout? idk this is an annoying problem but also really minor)
//addendum to above: change the css when clicked to make it look cooler. right now it looks really ugly
//TODO: transitions between buttons; give it a more natural feel
//TODO: prepare table and graph appearances

  componentWillReceiveProps(nextProps) {
    //There is no need to save the current comment?
    this.processComment(nextProps.currentComment);
    this.setState({showCommentData: nextProps.showCommentData});
    if (nextProps.showCommentData === false && this.state.showCommentData === true) {
      this.setState({dataButtonClass: "submit back"});
    }
  }

  processComment(comment) {
    //should be comment.author.name, but im using shavedComment
    if (comment.author !== "AutoModerator") {
        commentsAnalyzed++;
        let index = comment.body.indexOf(" "); //spaces are used to differentiate between words

        while (index !== -1) {
          let cleanedWord = processWord(comment.body.substring(0, index).toLowerCase()); //processWord normalizes the word and knocks off any extraneous stuff (recursive function)

          // //this loop should ensure that the word is fully processed before continuing
          // //probably not necessary after i turned processWord into a recursive function, but we shall see
          // while (cleanedWord != preProcessedWord && cleanedWord != DO_NOT_PROCESS) {
          //   preProcessedWord = cleanedWord;
          //   cleanedWord = processWord(preProcessedWord);
          // }

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
    this.setState({dataButtonClass: "submit back disappear"});
  }

  resetData() {
    this.setState({resetDataClass: "submit back resetFeedback"});
    storageMap = new Map();
    wordsAnalyzed = 0;
    commentsAnalyzed = 0;
    this.state.resetData(storageMap, wordsAnalyzed, commentsAnalyzed);
    this.memeDream();
  }

  memeDream() {
    setTimeout(() => {
      this.setState({resetDataClass: "submit back"});
    }, 500);
    console.log("im getting here");
  }

  render() {
    //use of span here is really helpful; preserves the in-lineness of the buttons
    //also, im being slightly lazy here by using span className to hide the button when pressed :)
    return(
      <span>
        <WorkerButton
          className={this.state.dataButtonClass}
          click={this.prepareData}
          text="SEE DATA"
        />
        <WorkerButton
          className={this.state.resetDataClass}
          click={this.resetData}
          text="RESET DATA"
        />
      </span>
    );
  }
}

export default CommentProcessor;
