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
      items: stateTree.getIn(['items'], new List()),
      currentTextboxValue:  stateTree.getIn(['currentTextboxValue'], '')
    }
  },
  // Updater methods. These return a new state tree and get hoisted to the component (this.updaters)
  (getStateTree) => {
    return {
      handleTodoInputChange: (e) => getStateTree().set('currentTextboxValue', e.target.value),
      addTodoItem: () => {
        let currentTextboxValue = getStateTree().getIn(['currentTextboxValue'], '')
        if (currentTextboxValue.length === 0) return getStateTree()
        return getStateTree().withMutations(stateTree => {
          stateTree
            .updateIn(['items'], items => (items || new List()).push(new TodoItemRecord({text: currentTextboxValue})))
            .set('currentTextboxValue', '')
        })
      },
      handleToggleCompleted: (index, e) => getStateTree().mergeIn(['items', index], {completed: e.target.checked}),
      removeTodoItem: (index) => getStateTree().updateIn(['items'], items => items.remove(index))
    }
  },
  // Namespace of the subtree that this component will use (i.e stateTree will be Root->Todo)
  ['Todo']
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
          type='textbox'
          value={this.props.currentTextboxValue}
          onChange={this.updaters.handleTodoInputChange}
          onKeyPress={(e) => {if (e.key === 'Enter') {this.updaters.addTodoItem()}}}
        />
        <button onClick={this.updaters.addTodoItem}>Add</button>
      </div>
    );
  }
}

export default Todo;
