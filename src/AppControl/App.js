//Necessary imports from node_modules
import React, { Component } from 'react';
import ReactFitText from 'react-fittext';

import Selector from '../SelectorInterface/Selector.js'
import BackButton from '../SelectorInterface/BackButton.js';
import CommentView from '../CommentView/CommentView.js';
import CommentProcessor from '../WordAnalysis/CommentProcessor.js';
import './App.css';

require("dotenv").config();
const Snoowrap = require("snoowrap");
const Snoostorm = require("snoostorm");

//Main parent class; controls individual components
class App extends Component {
  constructor(props) {
    super(props);
    //creates snoowrap instance
    const snoowrap = new Snoowrap({
      userAgent: "commentVisualizer737362",
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
      currentComment: "",
    };

    this.subredditHandle = this.handleSelectedSubreddit.bind(this);
    this.switchSubreddit = this.switchSubreddit.bind(this);
    this.resetSelector = this.resetSelector.bind(this);
    this.onFirstComment = this.handleFirstComment.bind(this);
    this.transferComment = this.transferComment.bind(this);
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
          {(this.state.loading) && <BackButton
              back={this.switchSubreddit}
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
          <BackButton
            back={this.switchSubreddit}
          />
          <CommentProcessor
            wordsAnalyzed={this.state.wordsAnalyzed}
            // transferViews={this.state.transferViews}
            currentComment={this.state.currentComment}
          />
        </div>}
        {/* CommentView interface */}
        {(this.state.subredditSelected) && <CommentView
          stream={this.state.currentStream}
          loading={this.state.loading}
          onFirstComment={this.onFirstComment}
          transferComment={this.transferComment}
        />}
      </div>
    );
  }
}

export default App;
