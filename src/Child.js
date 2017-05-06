import React, {Component} from 'react';
import logo from './logo.svg';
import {statify} from './statify'
import PropTypes from 'prop-types'

@statify(
  (stateTree, props) => {
    return {
      item: stateTree.getIn(['App', 'Child', 'item'], "HI"),
      checked:  stateTree.getIn(['App', `checked${props.index}`], true)
    }
  },
  (getStateTree) => ({
    handleCheckedChange: (index, e) => {
      return getStateTree().withMutations((stateTree) => {
        let updates = {}
        updates[`checked${index}`] = e.target.checked
        stateTree.mergeIn(['App'], updates)
      })
    }
  })
)
class Child extends Component {
  render() {
    return (
      <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Welcome to React</h2>
          </div>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
          <input type="checkbox" checked={this.props.checked} onChange={this.updaters.handleCheckedChange.bind(this, this.props.index)} />
        </div>
    )
  }
}

export default Child