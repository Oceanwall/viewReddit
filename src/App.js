import React, { Component } from 'react';
import './App.css';
require("dotenv").config();

const Snoowrap = require("snoowrap");
const Snoostorm = require("snoostorm"); //basic snoowrap shit

class Selector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      subredditCallback: props.onSubmit //store callback function in state
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
      <form onSubmit={(event) => this.state.subredditCallback(this.state.value, event)}>
        <input type="text" onChange={this.handleChange}/>
        <input type="submit" value="Submit" />
      </form>
    )
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
      subredditAdded: false,
      subredditSelected: false
    };

    //this is strange; do i really need to bind every freaking function in react?
    this.subredditHandle = this.handleSelectedSubreddit.bind(this);

  }

  handleSelectedSubreddit(subreddit, event) {
    //subreddit validation here
    //if successful, then adjust state
    //be sure to send response to child indicating if successful or not
    event.preventDefault();
    this.setState({subredditSelected: true});
    //maybe adding a little loading blurb if this takes too much time? or just make it disappear once confirmed LOL
    //confirmation
    // try {
    //   console.log(subreddit);
    //   this.state.snoo.getSubreddit("ewqeqqeqwe").getRules().then((rules) => {
    //     console.log(rules);
    //   }).catch((error) => {
    //     console.log(error);
    //   });
    // }
    // catch(error) {
    //   console.log(error);
    // }


    //snoostorm doesnt have its own validation feature, so we need to do it before we call it
    // let stream = this.state.client.CommentStream({
    //   subreddit: "ererer",
    //   results: 10,
    //   polltime: 1000
    // });


  }

  render() {
    return (
      <div>
        {!this.state.subredditSelected && <Selector
          onSubmit={this.subredditHandle}
        />}
      </div>
    );
  }
}

export default App;
