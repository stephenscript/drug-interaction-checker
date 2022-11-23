import React, { Component } from 'react';
import SelectDrugs from './components/SelectDrugs';
const fetch = require('node-fetch');

// import Row from './Row';
// import GameList from './GameList';
// import Leaders from './Leaders';
class App extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      data: null
    };
  }


  componentDidMount() {
    // fetch('/api', {
    //   headers :  {
    //     drug1: 'ibuprofen',
    //     drug2: 'losartan'
    //   }
    // })
    //   .then(res => res.json())
    //   .then(data => {
    //     console.log(data)
    //     this.setState({severity: data[0], message:data[1]});
    //   })
  }

  handleClick(row, square) {

    this.setState({
      rows,
      turn,
      winner,
    });
  }

  render() {
    const { severity, message } = this.state;
    console.log(message)
    return (
      <div>
        <SelectDrugs />
        <div>{severity}</div>
        <div>{message}</div>
      </div>
    );
  }
}

export default App;
