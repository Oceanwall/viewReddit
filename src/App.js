import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import ReactFitText from 'react-fittext';
import classNames from 'classnames';
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
    <div className="spinner">
      <div className="rect1" />
      <div className="rect2" />
      <div className="rect3" />
      <div className="rect4" />
      <div className="rect5" />
    </div>
  );
}

function Selected(props) {
  return (
    <button onClick={props.back} className="submit back">
      Go back
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
    }
    this.showComments();
  }

  showComments() {
    this.state.stream.on("comment", (comment) => {

      if (comment.body.length < 200) {
        let newCommentArray = this.state.comments.slice();

        //let's have 3 random format numbers for now. might need more in the future
        let randomFormatNumbers = [];
        for (let i = 0; i < 3; i++) {
            randomFormatNumbers[i] = Math.floor((Math.random() * 4) + 1);
        }

        let commentClass = classNames({
          "classyAppearance": true,
          [`randomFormat1${randomFormatNumbers[0]}`]: true,
          [`randomFormat2${randomFormatNumbers[1]}`]: true,
          [`randomFormat3${randomFormatNumbers[2]}`]: true,
        });
        let divLocation = `location${this.state.index}`;

        let newComment = <Comment
          location={divLocation}
          commentClass={commentClass}
          key={this.state.index}
          body={comment.body}
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

function Comment(props) {
  return (
    <div id={props.location} className={props.commentClass}>
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

      this.setState({selectedSubreddit: result.url, currentStream: stream, subredditSelected: true, loading: false});

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
          {!this.state.subredditSelected && <Selector
            onSubmit={this.subredditHandle}
            acceptable={this.state.acceptableSubreddit}
            reset={this.resetSelector}
          />}
        </div>
        <div className="lower">
          {this.state.loading && <LoadingScreen />}
        </div>
        <div className="top">
          {this.state.subredditSelected &&
          <ReactFitText compressor={1}>
            <div className="titleFont">
              {this.state.selectedSubreddit}
            </div>
          </ReactFitText>}
          {this.state.subredditSelected &&
            <Selected
              back={this.switchSubreddit}
            />}
        </div>
        {this.state.subredditSelected && <CommentView
          stream={this.state.currentStream}
        />}
      </div>
    );
  }
}

export default App;
