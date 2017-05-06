import React, { Component } from 'react';
import './App.scss';
import Child from './Child'
import {statify} from './statify'
import PropTypes from 'prop-types'
import { fromJS } from 'immutable'

@statify((stateTree) => {
  return {
    checked: {
      1: stateTree.getIn(['App', 'checked', '1'], true),
      2: stateTree.getIn(['App', 'checked', '2'], true),
      3: stateTree.getIn(['App', 'checked', '3'], true),
    }
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
