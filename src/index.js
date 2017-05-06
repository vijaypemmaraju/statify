import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import {StatifyProvider, stateTree} from './statify'

ReactDOM.render(
  <StatifyProvider stateTree={stateTree}>
    <App />
  </StatifyProvider>,
  document.getElementById('root')
);
