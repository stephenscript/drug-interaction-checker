import React, { Component } from 'react';
import SelectDrugs from './components/SelectDrugs';
const fetch = require('node-fetch');

// import Row from './Row';
// import GameList from './GameList';
// import Leaders from './Leaders';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  componentDidMount() {
  }

  render() {
    const { severity, message } = this.state;
    return (
      <div>
        <SelectDrugs />
        <div className="message">{message}</div>
      </div>
    );
  }
}

export default App;
