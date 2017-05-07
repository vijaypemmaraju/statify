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
      },
      handleToggleCompleted: (index, e) => {
        let checked = e.target.checked
        return getStateTree().withMutations((stateTree) => {
          stateTree.mergeIn(['Todo', 'items', index], {completed: checked})
        })
      },
      removeTodoItem: (index) => {
        return getStateTree().updateIn(['Todo', 'items'], items => items.remove(index))
      }
    }
  }
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
          onChange={this.updaters.handleTextboxChange}
          onKeyPress={(e) => {if (e.key === 'Enter') {this.updaters.addTodoItem()}}}
        />
        <button onClick={this.updaters.addTodoItem}>Add</button>
      </div>
    );
  }
}

export default Todo;
