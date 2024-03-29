import React, { Component } from 'react';

class SelectDrugs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      drug1: '',
      drug2: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

handleSubmit () {
  console.log('state:', this.state)
  fetch('/api', {
    headers :  { ...this.state }//{
    //   drug1: this.state.drug1,
    //   drug2: this.state.drug2
    // }
  })
    .then(res => res.json())
    .then(data => {
      console.log('data:', data[1])
      this.setState({ severity: data[0], message: data[1] });
      const { message } = this.state;
      console.log('message', message)
      if (!message) {
        this.setState({ ...this.state, message: 'No Interaction Found!' })
      } else if (message.length === 1) {
        this.setState({ ...this.state, message: 'Invalid Drug Name Detected! Check spelling.' })
      }
    })
}

handleInput(e) {
  const { drug1, drug2 } = e.target;
  console.log('target', e.target.name)
  this.setState({ [e.target.name] : e.target.value })
}

render() {
  return (
      <div className="Input">
      <div className="title">Drug Interaction Checker</div>
      <div className = "inputFields">
        <div htmlFor="drug1">Select Drugs for Interactions:</div>
        <input name="drug1" className="drugButton" placeholder="Drug Name" onChange={this.handleInput} />
        <input name="drug2" className="drugButton" placeholder="Drug Name" onChange={this.handleInput} />
        <button
              type="button"
              className="analyzeButton"
              onClick={this.handleSubmit}
            >
              Analyze
            </button>
      </div>
      <div className="message">{this.state.message}</div>
      </div>
      
    );
  }
}
export default SelectDrugs;