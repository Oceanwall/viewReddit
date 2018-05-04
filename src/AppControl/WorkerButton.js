import React, { Component } from 'react';

//General purpose button component
//Allows for onclick functionality, class styling, held text, and option to disable
class WorkerButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      click: props.click,
      className: props.className,
      text: props.text,
      hide: props.hide,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({className: nextProps.className, hide: nextProps.hide});
  }

  render() {
    return (
      <button onClick={this.state.click} className={this.state.className} disabled={this.state.hide}>
        {this.state.text}
      </button>
    );
  }
}

export default WorkerButton;
