### Intro
Statify is a state management framework that keeps all state inside a single tree/store, but with as little boilerplace as possible.

### Initialization
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import Todo from './Todo';
import './index.css';
import {StatifyProvider, stateTree} from './statify'

ReactDOM.render(
  <StatifyProvider stateTree={stateTree}>
    <Todo />
  </StatifyProvider>,
  document.getElementById('root')
);
```

### Usage
`Todo.js`
```javascript
import React, { Component } from 'react';
import './Todo.scss';
import TodoItem from './TodoItem'
import {statify} from './statify'
import {List} from 'immutable'
import TodoItemRecord from './models/TodoItemRecord'

@statify(
  // State definition (i.e. what will show up in this.props)
  (stateTree) => {
    return {
      items: stateTree.getIn(['Todo', 'items'], new List()),
      currentTextboxValue:  stateTree.getIn(['Todo', 'currentTextboxValue'], '')
    }
  },
  // Updater methods. These return a new state tree and get hoisted to the component (this.updaters)
  (getStateTree) => {
    return {
      handleTextboxChange: (e) => {
        return getStateTree().mergeIn(['Todo'], {currentTextboxValue: e.target.value})
      },
      addTodoItem: () => {
        let currentTextboxValue = getStateTree().getIn(['Todo', 'currentTextboxValue'])
        return getStateTree().withMutations(stateTree => {
          stateTree
            .updateIn(['Todo', 'items'], items => (items || new List()).push(new TodoItemRecord({text: currentTextboxValue})))
            .mergeIn(['Todo'], {currentTextboxValue: ''})
        })
      }
    }
  }
)
class Todo extends Component {
  render() {
    return (
      <div className="App">
        {this.props.items.map((item, index) => <TodoItem key={index} index={index} />)}
        <input type='textbox' value={this.props.currentTextboxValue} onChange={this.updaters.handleTextboxChange} />
        <button onClick={this.updaters.addTodoItem}>Add</button>
      </div>
    );
  }
}

export default Todo;
```

`TodoItem.js`
```javascript
@statify(
  (stateTree, props) => {
    return {
      item: stateTree.getIn(['Todo', 'items', props.index], new TodoItemRecord()),
    }
  },
  (getStateTree) => {
    let updates = {
      handleCheckedChange: async (index, e) => {
        let checked = e.target.checked
        return getStateTree().withMutations((stateTree) => {
          stateTree.mergeIn(['Todo', 'items', index], {completed: checked})
        })
      },
      removeTodoItem: async (index) => {
        return getStateTree().updateIn(['Todo', 'items'], items => items.remove(index))
      }
    }
    return updates;
  }
)
class TodoItem extends Component {
  render() {
    return (
      <div>
        <input type="checkbox" checked={this.props.checked} disabled={this.props.waiting ? "disabled" : false} onChange={this.updaters.handleCheckedChange.bind(this, this.props.index)} />
        {this.props.item.completed ? <strike>{this.props.item.text}</strike> : this.props.item.text}
        <button onClick={this.updaters.removeTodoItem.bind(this, this.props.index)}>Remove</button>
      </div>
    )
  }
}

export default TodoItem
```