import React, {Component} from 'react';
import {statify} from './statify'
import TodoItemRecord from './models/TodoItemRecord'

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