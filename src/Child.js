import React, {Component} from 'react';
import logo from './logo.svg';
import {StateTree, stateTree, statify} from './statify'
import PropTypes from 'prop-types'

@statify(
  (stateTree) => {
    return {
      item: stateTree.getIn(['App', 'Child', 'item'], "HI"),
      checked:  stateTree.getIn(['App', 'checked'], false)
    }
  },
  (stateTree) => ({
    handleCheckedChange: (e) => {
      return stateTree.withMutations((stateTree) => {
        stateTree.mergeIn(['App'], {
          checked: e.target.checked
        }).mergeIn(['App', 'Child'], {
          item: "BYE"
        })
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
          <input type="checkbox" checked={this.props.checked} onChange={this.updaters.handleCheckedChange} />
        </div>
    )
  }
}

export default Child