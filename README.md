### Intro
Statify is a state management framework that uses the existing component structure as its state shape.

### Initialization
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import {StatifyProvider, stateTree} from './statify'

ReactDOM.render(
  <StatifyProvider stateTree={stateTree}>
    <App />
  </StatifyProvider>,
  document.getElementById('root')
);
```

### Usage
```javascript
import React, {Component} from 'react';
import {statify} from './statify'

@statify(
  (stateTree, props) => {
    // State definition (i.e. what will show up in this.props)
    return {
      text: stateTree.getIn(['App', 'Child', props.index, 'text'], ''),
      waiting: stateTree.getIn(['App', 'Child', props.index, 'waiting'], false),
      checked:  stateTree.getIn(['App', 'checked', props.index.toString()], true),
    }
  },
  (getStateTree) => {
    // Updater methods. These return a new state tree and get hoisted to the component (this.updaters)
    let updates = {
      handleCheckedChange: async (index, e) => {
        let checked = e.target.checked
        await updates.setText(index, 'Waiting 1 second');
        await (new Promise((resolve) => setTimeout(() => resolve(), 1000)))
        await updates.setText(index, '');
        return getStateTree().withMutations((stateTree) => {
          let updates = {}
          updates[index.toString()] = checked
          updates.waiting = false;
          stateTree.mergeIn(['App', 'checked'], updates)
        })
      },
      setText: async (index, text) => {
        return getStateTree().withMutations((stateTree) => {
          stateTree.mergeIn(['App', 'Child', index], {text: text, waiting: true})
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
        {this.props.index}
        <input type="checkbox" checked={this.props.checked} disabled={this.props.waiting ? "disabled" : false} onChange={this.updaters.handleCheckedChange.bind(this, this.props.index)} />
        {this.props.text}
      </div>
    )
  }
}

export default Child
```
