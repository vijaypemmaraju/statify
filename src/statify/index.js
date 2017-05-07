import PropTypes from 'prop-types'
import React, { Component, Children } from 'react';
import { Map } from 'immutable'

const Statify = {stateTree: new Map()}
window.Statify = Statify

const StatifiedComposer = (StatifiedComponent, getState, namespace) => class StatifiedComponentWrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {ready: false};
  }
  componentDidMount() {
    this.setState({ ready: true });
  }
  render() {
    return this.state.ready && <StatifiedComponent {...Object.assign(getState.call(this, Statify.stateTree.getIn(namespace), this.props), this.props)} />
  }
};

// Class Decorator
const statify = function (component, getState, updaters, namespace = []) {

  if (updaters) {
    let appliedUpdaters = updaters(() => Statify.stateTree)
    Object.entries(appliedUpdaters).forEach(function([key, value]) {
      appliedUpdaters[key] = function(...args) {
        let result = value.apply(appliedUpdaters, args)
        if (result.then) {
          result.then((stateTree) => {
            Statify.stateTree = stateTree;
            notifyAll();
          })
        } else {
          Statify.stateTree = result;
          notifyAll();
        }

      }
    })

    component.prototype.updaters = appliedUpdaters
  }

  return StatifiedComposer(component, getState, namespace)
}

let listeners = []

function registerListener(component) {
  listeners.push(component);
}

function notifyAll() {
  listeners.forEach((listener) => listener.onUpdate())
}

const curriedStatify = (getState, updaters) => component => statify(component, getState, updaters)

class StatifyProvider extends Component {
  componentDidMount() {
    registerListener(this);
  }

  onUpdate() {
    this.setState({stateTree: Statify.stateTree})
  }

  render() {
    let child = Children.only(this.props.children)
    return React.cloneElement(child)
  }
}

let stateTree = Statify.stateTree
export {StatifyProvider, stateTree, curriedStatify as statify}
