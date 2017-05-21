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
