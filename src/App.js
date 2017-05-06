import React, { Component } from 'react';
import './App.scss';
import Child from './Child'
import {stateTree, statify} from './statify'
import PropTypes from 'prop-types'

@statify((stateTree) => {
  return {
    checked: stateTree.getIn(['App', 'checked'], true)
  }
})
class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Child />
    );
  }
}

export default App;
