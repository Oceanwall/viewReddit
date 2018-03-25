//Necessary imports from node_modules
import React, { Component } from 'react';
import ReactFitText from 'react-fittext';
import classNames from 'classnames';
import { CSSTransitionGroup } from 'react-transition-group';
import './App.css';
require("dotenv").config();

const Snoowrap = require("snoowrap");
const Snoostorm = require("snoostorm");

//Handles the subreddit selection interface
class Selector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      subredditCallback: props.onSubmit, //Store callback function in state
      acceptable: props.acceptable,
      reset: props.reset,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  //Updates state when parent's acceptable state property changes
  componentWillReceiveProps(nextProps) {
    this.setState({acceptable: nextProps.acceptable});
  }

  //Active handling of text within the input box.
  handleChange(event) {
    this.setState({value: event.target.value});
    this.state.reset();
  }

  //Renders the subreddit selection interface
  render() {
    return (
      <div>
        <div className="title">
          SUBREDDIT VISUALIZER
        </div>
        {this.state.acceptable &&
          <div className="subtitle">
            an oceanwall endeavor
          </div>
        }
        {!this.state.acceptable &&
          <div className="subtitle invalidText">
            Invalid Subreddit
          </div>
        }
        <form id="submit" onSubmit={(event) => this.state.subredditCallback(this.state.value, event)}>
          <input type="text" onChange={this.handleChange} className={!this.state.acceptable ? "invalidSubreddit" : undefined}/>
          <br />
          <button type="submit" disabled={!this.state.acceptable} className="submit">
            SUBMIT
          </button>
        </form>
      </div>
    )
  }
}

//Handles the "GO BACK" buttons for the loading screen and the Selected interfaces
function BackButton(props) {
  return (
    <button onClick={props.back} className="submit back">
      GO BACK
    </button>
  );
}

//Shows the comments once a snoostream connection has been made and comments have been obtained
class CommentView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stream: props.stream,
      comments: [],
      index: 0,
      filledOnce: false,
      loading: props.loading,
      onFirstComment: props.onFirstComment,
    }
    this.showComments(); //kicks off comment collection
  }

  //Takes in the stream's comments, audits them for length, and formats them before displaying them.
  //Also controls when the loading screen ends
  showComments() {
    this.state.stream.on("comment", (comment) => {
      //Comment length must be between 50 and 150 chararcters
      if (comment.body.length < 150 && comment.body.length > 50) {
        let newCommentArray = this.state.comments.slice();

        //Ends loading screen
        if (this.state.loading) {
          this.state.onFirstComment();
        }

        //Random formatting for comments
        let randomFormatNumber1 = Math.floor((Math.random() * 4) + 1);
        let randomFormatNumber2 = Math.floor((Math.random() * 4) + 1);

        let commentClass = classNames({
          "classyAppearance": true,
          [`color${randomFormatNumber1}`]: true,
          [`font${randomFormatNumber2}`]: true,
        });
        let divLocation = `location${this.state.index}`;

        //Removal of old comments allows for enter and leave transitions
        if (this.state.filledOnce) {
          newCommentArray[this.state.index] = null;
          this.setState({comments: newCommentArray});
        }

        //Wrapper is necessary to hold both Comment and CSSTransitionGroup
        let newComment = <CommentWrapper
          location={divLocation}
          commentClass={commentClass}
          body={comment.body}
          key={this.state.index}
        />
        newCommentArray[this.state.index] = newComment;

        let newIndex = (this.state.index + 1) % 16;
        if (newIndex === 0 && this.state.filledOnce === false) {
          this.setState({filledOnce: true});
        }
        this.setState({comments: newCommentArray, index: newIndex});
      }
    });
  }

  //Renders the array of comments
  render() {
    return (
      <div className="fill">
        {this.state.comments}
      </div>
    )
  }
}

//Wrapper class for CSSTransitionGroup and Comment
function CommentWrapper(props) {
  return (
    <div id={props.location}>
      <CSSTransitionGroup
        transitionName="transition"
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500} >
        <Comment
          body={props.body}
          commentClass={props.commentClass}
        />
      </CSSTransitionGroup>
    </div>
  );
}

//Creates raw comment, with styling and content
function Comment(props) {
  return (
    <div className={props.commentClass}>
      {props.body}
    </div>
  );
}

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
    };

    this.subredditHandle = this.handleSelectedSubreddit.bind(this);
    this.switchSubreddit = this.switchSubreddit.bind(this);
    this.resetSelector = this.resetSelector.bind(this);
    this.onFirstComment = this.handleFirstComment.bind(this);
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
        results: 5,
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
        <div className="top">
          {(this.state.subredditSelected && !this.state.loading) &&
            <ReactFitText compressor={1}>
              <div className="titleFont">
                {this.state.selectedSubreddit}
              </div>
            </ReactFitText>}
          {(this.state.subredditSelected && !this.state.loading) &&
            <BackButton
              back={this.switchSubreddit}
            />}
        </div>
        {/* CommentView interface */}
        {(this.state.subredditSelected) && <CommentView
          stream={this.state.currentStream}
          loading={this.state.loading}
          onFirstComment={this.onFirstComment}
        />}
      </div>
    );
  }
}

export default App;
