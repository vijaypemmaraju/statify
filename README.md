### Intro
Statify is a state management framework that keeps all state inside a single tree/store, but with as little boilerplate as possible.

### Initialization
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Map } from 'immutable'
import Todo from './Todo'
import './index.css';
import { initializeStatify } from './statify'

initializeStatify(new Map(), (stateTree, keyPath, updates) => stateTree.mergeIn(keyPath, updates))

ReactDOM.render(
  <Todo />,
  document.getElementById('root')
);
```

### Usage
`Todo.js`
```javascript
import React, { Component } from 'react';
import { Map, List } from 'immutable'
import './Todo.scss';
import TodoItem from './TodoItem'
import { statify } from './statify'
import TodoItemRecord from './models/TodoItemRecord'

@statify(
  // State definition (i.e. what will show up in this.props)
  (stateTree) => {
    return {
      items: stateTree.getIn(['items'], new List()),
      currentTextboxValue: stateTree.getIn(['currentTextboxValue'], '')
    }
  },
  // Updater methods. These return a new state tree and get hoisted to the component (this.updaters)
  (getStateTree) => {
    return {
      handleTodoInputChange: e => getStateTree().set('currentTextboxValue', e.target.value),
      addTodoItem: () => {
        const currentTextboxValue = getStateTree().getIn(['currentTextboxValue'], '')
        if (currentTextboxValue.length === 0) return getStateTree()
        return getStateTree().withMutations((stateTree) => {
          stateTree
            .updateIn(['items'], items => (items || new List()).push(new TodoItemRecord({ text: currentTextboxValue })))
            .set('currentTextboxValue', '')
        })
      },
      handleToggleCompleted: (index, e) => getStateTree().mergeIn(['items', index], { completed: e.target.checked }),
      removeTodoItem: index => getStateTree().updateIn(['items'], items => items.remove(index))
    }
  },
  // Keypath of the subtree that this component will use (i.e stateTree will be Root->Todo)
  ['Todo'],
  // How to navigate to the subtree given a keypath
  (stateTree, keyPath) => stateTree.getIn(keyPath, new Map())
)
class Todo extends Component {
  render() {
    return (
      <div className="App">
        {this.props.items.map((item, index) => {
          return (
            <TodoItem
              key={index}
              item={item}
              index={index}
              handleToggleCompleted={this.updaters.handleToggleCompleted}
              removeTodoItem={this.updaters.removeTodoItem}
            />
          )
        })}
        <input
          type="textbox"
          value={this.props.currentTextboxValue}
          onChange={this.updaters.handleTodoInputChange}
          onKeyPress={(e) => { if (e.key === 'Enter') { this.updaters.addTodoItem() } }}
        />
        <button onClick={this.updaters.addTodoItem}>Add</button>
      </div>
    );
  }
}

export default Todo;
```

`TodoItem.js`
```javascript
import React from 'react';

const TodoItem = ({ item, index, handleToggleCompleted, removeTodoItem }) => {
  return (
    <div>
      <input type="checkbox" checked={item.completed} onChange={handleToggleCompleted.bind(this, index)} />
      {item.completed ? <strike>{item.text}</strike> : item.text}
      <button onClick={removeTodoItem.bind(this, index)}>Remove</button>
    </div>
  )
}

export default TodoItem
```