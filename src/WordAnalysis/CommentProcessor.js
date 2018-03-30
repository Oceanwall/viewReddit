
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

class CommentProcessor extends Component {
  constructor(props) {
    super(props);
    let storageMap = new Map();
    this.state = {
      currentComment: props.currentComment,
      wordMap: storageMap,
      wordsAnalyzed: props.wordsAnalyzed,
    }
  }

//NOTE: Current issue: Some weird synchronous problems are happening, where
// the code is being stuck on processComment() rather than asynchronously letting
// it happen. Also, I'm not altogether confident that updating state every
// single time is a good idea.
  // componentWillReceiveProps(nextProps) {
  //   //There is no need to save the current comment?
  //   this.processComment(nextProps.currentComment);
  //   this.setState({currentComment: nextProps.currentComment});
  //   console.log("hello world");
  // }



  processComment(comment) {
    if (comment.author.name !== "AutoModerator") {
        // commentsAnalyzed++;
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
            this.setState({wordsAnalyzed: (this.state.wordsAnalyzed + 1)});
            //not sure if this is the most efficient way of doing this, but we will see
            let newWordMap = new Map(this.state.wordMap);
            let result = newWordMap.get(cleanedWord);

            if (result === undefined) { //if not already in map, add it to map
              newWordMap.set(cleanedWord, 1);
            }
            else {
              newWordMap.set(cleanedWord, result + 1);
            }

            this.setState({wordMap: newWordMap});
          }

          comment.body = comment.body.substring(index + 1);
          index = comment.body.indexOf(" ");
        }
      }
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
