import React, { Component } from 'react';
import './App.scss';
import Child from './Child'
import {statify} from './statify'
import PropTypes from 'prop-types'

@statify((stateTree) => {
  return {
    checked1: stateTree.getIn(['App', 'checked1'], true),
    checked2: stateTree.getIn(['App', 'checked2'], true),
    checked3: stateTree.getIn(['App', 'checked3'], true)
  }
})
class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <Child key={1} index={1} />
        <Child key={2} index={2} />
        <Child key={3} index={3} />
      </div>
    );
  }
}

export default App;
