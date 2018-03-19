import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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
    this.showComment();
  }

  showComment() {
    this.state.stream.on("comment", (comment) => {
      //dirty slicing below, avert your eyes!
      if (comment.body.length < 200) {
        let newCommentArray = this.state.comments.slice();

        // let classes = classNames({
        //   [`location${this.state.index}`]: true,
        //   "classyAppearance": true,
        // });

        let newComment = <div key={'Comment' + this.state.index}
                              className="classyAppearance">
                              {comment.body}
                          </div>;

        newCommentArray[this.state.index] = newComment;
        let newIndex = (this.state.index + 1) % 16;
        if (newIndex === 0 && this.state.filledOnce === false) {
          this.setState({filledOnce: true});
        }
        this.setState({comments: newCommentArray, index: newIndex});

        if (!this.state.filledOnce) {
          for (let i = 0; i < this.state.index; i++) {
            ReactDOM.render(this.state.comments[i], document.getElementById(`location${i}`));
          }
        }
        else {
          for (let i = 0; i < 16; i++) {
            ReactDOM.render(this.state.comments[i], document.getElementById(`location${i}`));
          }
        }
        // ReactDOM.render(this.state.comments, document.getElementById(`location${this.state.index}`));
      }
    });
  }

  render() {
    //NOTE: Current focus: Beautiful appearingn/disappearing of comments, hardcode positions? css them up
    //NOTE: ALSO, comment length, comment screen, maybe do something with how text moves when red text appears? hmm
    //this automatically clears when back button is pressed, thankfully
    return (
      <div />
    );
  }
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
        <div className="bottom">
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
        <div id="location0">Working, I hope</div>
        <div id="location1">Working, I hope</div>
        <div id="location2">Working, I hope</div>
        <div id="location3">Working, I hope</div>
        <div id="location4">Working, I hope</div>
        <div id="location5">Working, I hope</div>
        <div id="location6">Working, I hope</div>
        <div id="location7">Working, I hope</div>
        <div id="location8">Working, I hope</div>
        <div id="location9">Working, I hope</div>
        <div id="location10">Working, I hope</div>
        <div id="location11">Working, I hope</div>
        <div id="location12">Working, I hope</div>
        <div id="location13">Working, I hope</div>
        <div id="location14">Working, I hope</div>
        <div id="location15">Working, I hope</div>
        <div>
          {/* might run into a problem here with regard to the back button; well, i'll fix it if it comes to that... */}
          {this.state.subredditSelected && <CommentView
            stream={this.state.currentStream}
          />}
        </div>
      </div>
    );
  }
}

export default App;
