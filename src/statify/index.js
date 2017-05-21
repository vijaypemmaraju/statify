import React, { Component } from 'react';

const Statify = {
  stateTree: null
}

window.Statify = Statify

// Higher-order function to inject state into a component
const StatifiedComposer = (StatifiedComponent, getState, keyPath, treeModifier) => class StatifiedComponentWrapper extends Component {
  constructor(props) {
    super(props)
    registerListener(this);
    this.state = {ready: false, stateTree: treeModifier(Statify.stateTree, keyPath)};
  }
  componentDidMount() {
    this.setState({ ready: true });
  }
  onUpdate() {
    this.setState({stateTree: treeModifier(Statify.stateTree, keyPath)})
  }
  render() {
    return this.state.ready && <StatifiedComponent {...Object.assign(getState.call(this, this.state.stateTree, this.props), this.props)} />
  }
};

// Class Decorator
const statify = function (component, getState, updaters, keyPath, treeModifier = a => a) {
  if (updaters) {
    let appliedUpdaters = updaters(() => treeModifier(Statify.stateTree, keyPath))
    Object.entries(appliedUpdaters).forEach(function([key, value]) {
      appliedUpdaters[key] = function(...args) {
        let result = value.apply(appliedUpdaters, args)
        if (result.then) {
          result.then((stateTree) => {
            Statify.stateTree = Statify.mergeUpdates(Statify.stateTree, keyPath, stateTree);
            notifyAll();
          })
        } else {
          Statify.stateTree = Statify.mergeUpdates(Statify.stateTree, keyPath, result);
          notifyAll();
        }

      }
    })

    component.prototype.updaters = appliedUpdaters
  }

  return StatifiedComposer(component, getState, keyPath, treeModifier)
}

let listeners = []

function registerListener(component) {
  listeners.push(component);
}

function notifyAll() {
  listeners.forEach((listener) => listener.onUpdate())
}

const curriedStatify = (getState, updaters, keyPath, treeModifier) => component => statify(component, getState, updaters, keyPath, treeModifier)

function initializeStatify(initialValue, mergeUpdates) {
  Statify.stateTree = initialValue
  Statify.mergeUpdates = mergeUpdates
}
export {initializeStatify, curriedStatify as statify}
