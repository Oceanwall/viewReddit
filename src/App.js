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
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    console.log(this.state.value);
  }

  handleSubmit(event) {
    console.log("submitted value: " + this.state.value);
    this.state.subredditCallback(this.state.value); //i cant believe this worked
    event.preventDefault(); //to stop page from refreshing
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" onChange={this.handleChange} />
        <input type="submit" value="Submit" />
      </form>
    )
  }
}


class App extends Component {
  constructor(props) {
    super(props);
    let snoo = new Snoowrap({
      userAgent: "commentVisualizerv3318",
      clientId: process.env.REACT_APP_CLIENT_ID,
      clientSecret: process.env.REACT_APP_CLIENT_SECRET,
      username: process.env.REACT_APP_REDDIT_USER,
      password: process.env.REACT_APP_REDDIT_PASS
    });
    let client = new Snoostorm(snoo);
    this.state = {
      client: client,
      subredditAdded: false
    };
  }

  handleSelectedSubreddit(subreddit) {
    //subreddit validation here
    //if successful, then adjust state
    //be sure to send response to child indicating if successful or not
    console.log(subreddit);
  }

  render() {
    return (
      <Selector
        onSubmit={this.handleSelectedSubreddit}
      />
    );
  }
}

export default App;
