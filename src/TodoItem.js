import React from 'react';

const TodoItem = ({item, index, completed, handleToggleCompleted, removeTodoItem}) => {
  return (
    <div>
      <input type="checkbox" checked={item.completed} onChange={handleToggleCompleted.bind(this, index)} />
      {item.completed ? <strike>{item.text}</strike> : item.text}
      <button onClick={removeTodoItem.bind(this, index)}>Remove</button>
    </div>
  )
}

export default TodoItem