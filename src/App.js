import React, { Component } from 'react';
import './App.scss';
import TodoItem from './TodoItem'
import {statify} from './statify'
import {List} from 'immutable'
import TodoItemRecord from './models/TodoItemRecord'
@statify(
  (stateTree) => {
    return {
      items: stateTree.getIn(['Todo', 'items'], new List()),
      currentTextboxValue:  stateTree.getIn(['Todo', 'currentTextboxValue'], '')
    }
  },
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
class App extends Component {
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

export default App;
