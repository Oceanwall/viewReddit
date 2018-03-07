import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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
    };

    //this may seem slightly inefficient, but I trust the react docs
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return (
      //this syntax is considered to be the "good" way to handle callbacks with multiple parameters, as otherwise, the function automatically calls cause parentheses
      //use a button, much more customizable for later
      <form id="submit" onSubmit={(event) => this.state.subredditCallback(this.state.value, event)}>
        <input type="text" onChange={this.handleChange}/>
        <button type="submit" id="submit">
          Submit!
        </button>
        {this.state.acceptable && <div/>}
        {/* TODO: render indication that a non-existant subreddit was entered, remove it when the user clicks on the input box, and then relay that information back to the parent component (using callback function? maybe make submit button unclickable while we're at it omegalul) */}
        {/* <input type="submit" value="Submit" /> */}
      </form>
    )
  }
}

class Selected extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subreddit: props.subreddit,
      back: props.back,
    };
  }
  render() {
    return (
      // mandatory parent element
      <div>
        <p>{this.state.subreddit}</p>
        <button onClick={this.state.back}>
          Go back
        </button>
      </div>
    );
  }
}

class CommentView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stream: props.stream,
    }
  }

  showComment() {
    this.state.stream.on("comment", (comment) => {
      let element = (
        <div>
          {comment.body}
        </div>
      );
      ReactDOM.render(element, document.getElementById('comments'));
    });
  }

  render() {
    this.showComment();
    return (
      <div id="comments">
        Hello world
      </div>
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
    };

    //this is strange; do i really need to bind every freaking function in react?
    this.subredditHandle = this.handleSelectedSubreddit.bind(this);
    this.switchSubreddit = this.switchSubreddit.bind(this);

  }

  handleSelectedSubreddit(subreddit, event) {
    //subreddit validation here
    //if successful, then adjust state
    //be sure to send response to child indicating if successful or not
    event.preventDefault();
    //confirmation
    this.state.snoo.getSubreddit(subreddit).fetch()
    .then((result) => {
      console.log("exists, nice");

      let stream = this.state.client.CommentStream({
        subreddit: subreddit,
        results: 10,
        polltime: 1000
      });

      this.setState({selectedSubreddit: subreddit, currentStream: stream, subredditSelected: true});

    }).catch((error) => {
      console.log("doesnt exist, ayylmao");

      //TODO: config this and link to lower levels
      this.setState({acceptableSubreddit: false});
    })
  }

  switchSubreddit() {
    this.state.currentStream.emit("stop");
    //end snoostream

    console.log("hello world");
    this.setState({subredditSelected: false,
                   selectedSubreddit: "",
                 });
  }


  render() {
    return (
      <div>
        <div>
          {!this.state.subredditSelected && <Selector
            onSubmit={this.subredditHandle}
            acceptable={this.state.acceptableSubreddit}
          />}
          {this.state.subredditSelected && <Selected
            subreddit={this.state.selectedSubreddit}
            back={this.switchSubreddit}
          />}
        </div>
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
