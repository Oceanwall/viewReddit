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
        {/* this syntax is considered to be the "good" way to handle callbacks with multiple parameters */}
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

function BackButton(props) {
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
      if (comment.body.length < 150 && comment.body.length > 50) {
        let newCommentArray = this.state.comments.slice();

        if (this.state.loading) {
          this.state.onFirstComment();
        }

        let randomFormatNumber1 = Math.floor((Math.random() * 4) + 1);
        let randomFormatNumber2 = Math.floor((Math.random() * 4) + 1);

        let commentClass = classNames({
          "classyAppearance": true,
          [`color${randomFormatNumber1}`]: true,
          [`font${randomFormatNumber2}`]: true,
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

// NOTE: Current focus: Comment CSS? Fix red invalid text? Add some more randomizable features? We are almost done here.

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
      let stream = this.state.client.CommentStream({
        subreddit: subreddit,
        results: 5,
        polltime: 1000,
      });

      this.setState({selectedSubreddit: result.url, currentStream: stream, subredditSelected: true});
    }).catch((error) => {
      this.setState({acceptableSubreddit: false, loading: false});
    });
  }

  switchSubreddit() {
    this.state.currentStream.emit("stop");
    //end snoostream

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
          {(!this.state.subredditSelected && !this.state.loading) && <Selector
            onSubmit={this.subredditHandle}
            acceptable={this.state.acceptableSubreddit}
            reset={this.resetSelector}
          />}
        </div>
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
