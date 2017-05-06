import React, {Component} from 'react';
import logo from './logo.svg';
import {statify} from './statify'
import PropTypes from 'prop-types'

@statify(
  (stateTree, props) => {
    return {
      text: stateTree.getIn(['App', 'Child', props.index, 'text'], ''),
      checked:  stateTree.getIn(['App', 'checked', props.index.toString()], true)
    }
  },
  (getStateTree) => {
    let updates = {
      handleCheckedChange: async (index, e) => {
        let checked = e.target.checked
        await updates.setText(index, 'Waiting 1 second');
        await (new Promise((resolve) => setTimeout(() => resolve(), 1000)))
        await updates.setText(index, '');
        return getStateTree().withMutations((stateTree) => {
          let updates = {}
          updates[index.toString()] = checked
          stateTree.mergeIn(['App', 'checked'], updates)
        })
      },
      setText: async (index, text) => {
        return getStateTree().withMutations((stateTree) => {
          stateTree.mergeIn(['App', 'Child', index], {text: text})
        })
      }
    }
    return updates;
  }
)
class Child extends Component {

  render() {
    return (
      <div className="App">
        {this.props.index}<input type="checkbox" checked={this.props.checked} onChange={this.updaters.handleCheckedChange.bind(this, this.props.index)} />
        {this.props.text}
      </div>
    )
  }
}

export default Child