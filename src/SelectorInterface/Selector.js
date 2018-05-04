import React, { Component } from 'react';

//Allows user to select the subreddit of interest
class Selector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      subredditCallback: props.onSubmit,
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

export default Selector;
