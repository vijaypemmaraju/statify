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
