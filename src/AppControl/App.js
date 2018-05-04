//Necessary imports from node_modules
import React, { Component } from 'react';
import ReactFitText from 'react-fittext';
import swal from 'sweetalert';

import Selector from '../SelectorInterface/Selector.js'
import WorkerButton from './WorkerButton.js';
import CommentView from '../CommentView/CommentView.js';
import CommentProcessor from '../WordAnalysis/CommentProcessor.js';
import TableData from '../DataDisplays/TableData.js';
import GraphData from '../DataDisplays/GraphData.js';
import './App.css';

require("dotenv").config();
const Snoowrap = require("snoowrap");
const Snoostorm = require("snoostorm");

//Main parent class; controls individual components
class App extends Component {
  constructor(props) {
    super(props);
    //creates snoowrap instance
    //DONT do this with webapp; different authentication process for that
    const snoowrap = new Snoowrap({
      userAgent: "viewForReddit737362",
      clientId: process.env.REACT_APP_CLIENT_ID,
      clientSecret: process.env.REACT_APP_CLIENT_SECRET,
      username: process.env.REACT_APP_REDDIT_USER,
      password: process.env.REACT_APP_REDDIT_PASS
    });
    //uses snoowrap instance for snoostorm instance
    let client = new Snoostorm(snoowrap);

    this.state = {
      snoo : snoowrap,
      client: client,
      subredditSelected: false,
      selectedSubreddit: "",
      acceptableSubreddit: true,
      loading: false,
      wordMap: {},
      wordsAnalyzed: 0,
      commentsAnalyzed: 0,
      currentComment: "",
      showCommentData: false,
      top500Words: [],
      showGraphData: false
    };

    this.subredditHandle = this.handleSelectedSubreddit.bind(this);
    this.switchSubreddit = this.switchSubreddit.bind(this);
    this.unconditionallySwitchSubreddit = this.unconditionallySwitchSubreddit.bind(this);
    this.resetSelector = this.resetSelector.bind(this);
    this.onFirstComment = this.handleFirstComment.bind(this);
    this.transferComment = this.transferComment.bind(this);
    this.transferViews = this.transferViews.bind(this);
    this.switchViews = this.switchViews.bind(this);
    this.resetData = this.resetData.bind(this);
    this.getTop500 = this.getTop500.bind(this);
  }

  getTop500(topWords) {
    //Note: topWords is not guarenteed to hold 500 words, but it will hold at max 500 words.
    //Each word contains the word string, its frequency, and its relative frequency as properties.
    this.setState({top500Words: topWords, showGraphData: true});
  }

  //hypothetically, i could blend all three of these functions into one utility function BUT that would be messy so why would I?
  resetData(newMap, newWordsAnalyzed, commentsAnalyzed) {
    this.setState({wordMap: newMap, wordsAnalyzed: newWordsAnalyzed, commentsAnalyzed: commentsAnalyzed});
  }

  switchViews() {
    this.setState({showCommentData: false, showGraphData: false});
  }

  //commentview does not stop while this is happening, but css allows for easy "apparent" view changes
  transferViews(newMap, newWordsAnalyzed, commentsAnalyzed) {
    //this should NOT cause the commmentstream to stop
    this.setState({wordMap: newMap, wordsAnalyzed: newWordsAnalyzed, commentsAnalyzed: commentsAnalyzed, showCommentData: true});
  }

  transferComment(comment) {
    this.setState({currentComment: comment});
  }

  //Ends loading screen, ensures that user does not have to start at empty screen during loading process
  handleFirstComment() {
    this.setState({loading: false});
  }

  handleSelectedSubreddit(subreddit, event) {
    //Subreddit validation
    this.setState({loading: true});
    event.preventDefault();

    //Getting confirmation from reddit servers
    this.state.snoo.getSubreddit(subreddit).fetch()
    .then((result) => {
      //If successful, create the CommentStream and prepare to provide comments
      let stream = this.state.client.CommentStream({
        subreddit: subreddit,
        results: 6,
        polltime: 1000,
      });
      this.setState({selectedSubreddit: result.url, currentStream: stream, subredditSelected: true});
    }).catch((error) => {
      //If subreddit does not exist, edit state properties to indicate this
      this.setState({acceptableSubreddit: false, loading: false});
    });
  }

  //Called when either of the "Back" buttons are pressed
  //Ends the SnooStream and resets to Selector interface
  switchSubreddit() {
    swal({
      title: "Are you sure?",
      text: "Your data will be reset when you switch subreddits.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((switchDesire) => {
      if (switchDesire) {
        this.state.currentStream.emit("stop");

        this.setState({
          subredditSelected: false,
          selectedSubreddit: "",
          loading: false,
        });
      }
    });
  }

  unconditionallySwitchSubreddit() {
    this.state.currentStream.emit("stop");

    this.setState({
      subredditSelected: false,
      selectedSubreddit: "",
      loading: false,
    });
  }

  //Called when input box is clicked, removes red indicator
  resetSelector() {
    this.setState({acceptableSubreddit: true});
  }

  //Main render function for the entire application
  //Uses many conditional renders to ensure that only certain components are visible at each stage
  render() {
    return (
      <div id="container">
        {/* Selector Interface */}
        <div className="middle">
          {(!this.state.subredditSelected && !this.state.loading) && <Selector
            onSubmit={this.subredditHandle}
            acceptable={this.state.acceptableSubreddit}
            reset={this.resetSelector}
          />}
        </div>
        {/* Loading Screen */}
        <div className="loading">
          {(this.state.loading) && <ReactFitText compressor={1}>
            <div className="bounce loadingText">
              LOADING...
            </div>
          </ReactFitText>}
          {(this.state.loading) && <WorkerButton
              className="submit back"
              click={this.unconditionallySwitchSubreddit}
              text="GO BACK"
            />}
        </div>
        {/* Selected Interface */}
        {(this.state.subredditSelected && !this.state.loading) &&
          <div className="top">
          <ReactFitText compressor={1}>
            <div className="titleFont">
              {this.state.selectedSubreddit}
            </div>
          </ReactFitText>
          {!this.state.showCommentData &&
          <WorkerButton
            className="submit back"
            click={this.switchSubreddit}
            text="GO BACK"
          />}
          {this.state.showCommentData &&
          <WorkerButton
            className="submit back"
            click={this.switchViews}
            text="GO BACK"
          />}
          <CommentProcessor
            subredditName={this.state.selectedSubreddit}
            transferViews={this.transferViews}
            resetData={this.resetData}
            currentComment={this.state.currentComment}
            showCommentData={this.state.showCommentData}
          />
        </div>}
        {/* CommentView interface */}
        {(this.state.subredditSelected) &&
          <CommentView
            stream={this.state.currentStream}
            loading={this.state.loading}
            onFirstComment={this.onFirstComment}
            transferComment={this.transferComment}
            showCommentData={this.state.showCommentData}
          />
        }
        {(this.state.showCommentData) &&
          <div className="fill">
            <TableData
              showCommentData={this.state.showCommentData}
              wordMap={this.state.wordMap}
              wordsAnalyzed={this.state.wordsAnalyzed}
              commentsAnalyzed={this.state.commentsAnalyzed}
              getTop500={this.getTop500}
             />
             <div className="dataBody">
              {(this.state.showGraphData) &&
                <GraphData
                  topWords={this.state.top500Words}
                />
              }
            </div>
          </div>
        }
      </div>
    );
  }
}

export default App;
