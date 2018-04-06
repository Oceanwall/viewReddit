//words analyzed and storage map should be props passed down from app.js
//this component handles tracking, etc; another component will handle display?
//how do i shove live comments into this bad boy of a component?
//ANSWER: to pass between siblings, must use parent as intermediary
//maybe have prop comment; when that gets updated, call the processComment function on it? no need to actually update state?
//one ufnction here (switch views) and another function for the other component (reset?)
//Do I hide this behind a button?
import React, { Component } from 'react';
import { processWord } from './WordProcessor.js';
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
    }
    // console.log(this.state.transferViews);

    storageMap = new Map();
    wordsAnalyzed = 0;
    commentsAnalyzed = 0;

    this.prepareData = this.prepareData.bind(this);
  }

//TODO: Fix back buttons (make conditional based on what's active?), reset data collection (two buttons to do it?)
//TODO: then, make the switch between interfaces and stuff (maybe loading screen for seedata? think)
//prepare table and graph appearances

  componentWillReceiveProps(nextProps) {
    //There is no need to save the current comment?
    this.processComment(nextProps.currentComment);
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
  }

  render() {
    return(
      <button onClick={this.prepareData} className="submit back">
        SEE DATA
      </button>
    );
  }
}

export default CommentProcessor;
