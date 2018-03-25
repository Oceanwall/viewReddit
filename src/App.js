import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import ReactFitText from 'react-fittext';
import classNames from 'classnames';
import { CSSTransitionGroup } from 'react-transition-group';
import './App.css';
require("dotenv").config();

const Snoowrap = require("snoowrap");
const Snoostorm = require("snoostorm"); //basic snoowrap shit

class Selector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      subredditCallback: props.onSubmit, //store callback function in state
      acceptable: props.acceptable,
      reset: props.reset,
    };

    //this may seem slightly inefficient, but I trust the react docs
    this.handleChange = this.handleChange.bind(this);
  }

  //Because the constructor is only called the first time that the component renders, this method is necessary to consistently update the state from the parent
  componentWillReceiveProps(nextProps) {
    this.setState({acceptable: nextProps.acceptable});
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    this.state.reset();
  }

  render() {
    return (
      //this syntax is considered to be the "good" way to handle callbacks with multiple parameters, as otherwise, the function automatically calls cause parentheses
      //use a button, much more customizable for later
      <div>
        <div className="title">
          SUBREDDIT VISUALIZER
        </div>
        <div className="subtitle">
          an oceanwall endeavor
        </div>
        <form id="submit" onSubmit={(event) => this.state.subredditCallback(this.state.value, event)}>
          <input type="text" onChange={this.handleChange}/>
          <br />
          <button type="submit" id="submit" disabled={!this.state.acceptable} className="submit">
            SUBMIT
          </button>
          {!this.state.acceptable &&
            <div className="invalid-text">
              INVALID SUBREDDIT
            </div>}
        </form>
      </div>
    )
  }
}

function LoadingScreen(props) {
  return (
    <div>
      <div className="bounce loadingText">
        LOADING...
      </div>
      <button className="submit back ">
        GO BACK
      </button>
    </div>
  );
}

function Selected(props) {
  return (
    <button onClick={props.back} className="submit back">
      GO BACK
    </button>
  );
}

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
    this.showComments();
  }

  showComments() {
    this.state.stream.on("comment", (comment) => {

      if (comment.body.length < 150) {
        let newCommentArray = this.state.comments.slice();

        if (this.state.loading) {
          this.state.onFirstComment();
        }

        //let's have 3 random format numbers for now. might need more in the future
        let randomFormatNumbers = [];
        for (let i = 0; i < 3; i++) {
            randomFormatNumbers[i] = Math.floor((Math.random() * 4) + 1);
        }

        let commentClass = classNames({
          "classyAppearance": true,
          [`color${randomFormatNumbers[0]}`]: true,
          [`font${randomFormatNumbers[1]}`]: true,
          [`randomFormat3${randomFormatNumbers[2]}`]: true,
        });
        let divLocation = `location${this.state.index}`;

        //allow enter and leave transitions
        if (this.state.filledOnce) {
          newCommentArray[this.state.index] = null;
          this.setState({comments: newCommentArray});
        }

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

    render() {
      return (
        <div className="fill">
          {this.state.comments}
        </div>
      )
    }
}

// NOTE: Current focus; Make comments look pretty (make appearances and leaving better looking, randomize that)
// randomize fonts? Centralize fonts (maybe adjust font sizes as necessary? dynamic?) we're almost done here.
// Work on loading screen; add back button and fancy text?

function CommentWrapper(props) {
  return (
    <div id={props.location}>
      <CSSTransitionGroup
        transitionName="transition1"
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500} >
        {/* NOTE: Comment can't be replaced w/ just props.body. Look into this? */}
        <Comment
          body={props.body}
          commentClass={props.commentClass}
        />
      </CSSTransitionGroup>
    </div>
  );
}

function Comment(props) {
  return (
    <div className={props.commentClass}>
      {props.body}
    </div>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    const snoowrap = new Snoowrap({
      userAgent: "commentVisualizerv3318",
      clientId: process.env.REACT_APP_CLIENT_ID,
      clientSecret: process.env.REACT_APP_CLIENT_SECRET,
      username: process.env.REACT_APP_REDDIT_USER,
      password: process.env.REACT_APP_REDDIT_PASS
    });

    let client = new Snoostorm(snoowrap);
    this.state = {
      snoo : snoowrap,
      client: client,
      subredditSelected: false,
      selectedSubreddit: "",
      acceptableSubreddit: true,
      loading: false,
    };

    //this is strange; do i really need to bind every freaking function in react?
    this.subredditHandle = this.handleSelectedSubreddit.bind(this);
    this.switchSubreddit = this.switchSubreddit.bind(this);
    this.resetSelector = this.resetSelector.bind(this);
    this.onFirstComment = this.handleFirstComment.bind(this);
  }

  //ends loading screen, avoids forcing user to have to stare at empty screen for long time
  handleFirstComment() {
    this.setState({loading: false});
  }

  handleSelectedSubreddit(subreddit, event) {
    //subreddit validation here
    //if successful, then adjust state
    //be sure to send response to child indicating if successful or not
    this.setState({loading: true});
    event.preventDefault();
    //confirmation
    this.state.snoo.getSubreddit(subreddit).fetch()
    .then((result) => {
      console.log("exists, nice");

      let stream = this.state.client.CommentStream({
        subreddit: subreddit,
        results: 2,
        polltime: 1000,
      });

      this.setState({selectedSubreddit: result.url, currentStream: stream, subredditSelected: true});

    }).catch((error) => {
      console.log("doesnt exist, ayylmao");

      //TODO: config this and link to lower levels
      this.setState({acceptableSubreddit: false, loading: false});
    });
  }

  switchSubreddit() {
    this.state.currentStream.emit("stop");
    //end snoostream

    console.log("commentstream stopped");
    this.setState({subredditSelected: false,
                   selectedSubreddit: "",
                   loading: false,
                 });
  }

  //called when input box is clicked, removes red indicator
  resetSelector() {
    this.setState({acceptableSubreddit: true});
  }


  render() {
    return (
      <div id="container">
        <div className="middle">
          {(!this.state.subredditSelected && this.state.loading) && <Selector
            onSubmit={this.subredditHandle}
            acceptable={this.state.acceptableSubreddit}
            reset={this.resetSelector}
          />}
        </div>
        <div className="middle loading">
          {(!this.state.loading) && <LoadingScreen />}
        </div>
        <div className="top">
          {(this.state.subredditSelected && !this.state.loading) &&
          <ReactFitText compressor={1}>
            <div className="titleFont">
              {this.state.selectedSubreddit}
            </div>
          </ReactFitText>}
          {(this.state.subredditSelected && !this.state.loading) &&
            <Selected
              back={this.switchSubreddit}
            />}
        </div>
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
