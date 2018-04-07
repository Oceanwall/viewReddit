import React, { Component } from 'react';

class WorkerButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      click: props.click,
      className: props.className,
      text: props.text,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({className: nextProps.className});
  }

  render() {
    return (
      <button onClick={this.state.click} className={this.state.className}>
        {this.state.text}
      </button>
    );
  }
}

export default WorkerButton;
