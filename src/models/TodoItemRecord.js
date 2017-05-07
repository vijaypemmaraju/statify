import {Record} from 'immutable'

class TodoItemRecord extends Record({
  text: '',
  completed: false
}) {

}

export default TodoItemRecord