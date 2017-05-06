import PropTypes from 'prop-types'
import React, { Component, Children } from 'react';
import { Map } from 'immutable'

const stateTree = new Map();
window.stateTree = stateTree

const StatifiedComposer = (StatifiedComponent, getState) => class StatifiedComponentWrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {ready: false};
  }
  componentDidMount() {
    this.setState({ ready: true });
  }
  render() {
    return this.state.ready && <StatifiedComponent {...getState.call(this, window.stateTree)} />
  }
};

// Class Decorator
const statify = function (component, getState, updaters) {
  component.contextTypes = {owner: PropTypes.any}
  component.childContextTypes = {owner: PropTypes.any}
  component.prototype.__getStateTree = () => stateTree


  component.prototype.getChildContext = function () {
    return {owner: this}
  }

  component.prototype.name = component.name

  component.prototype.__componentWillMount = component.prototype.componentWillMount

  component.prototype.getStatifyProps = getState

  if (updaters) {
    let appliedUpdaters = updaters(stateTree)
    Object.entries(appliedUpdaters).forEach(function([key, value]) {
      appliedUpdaters[key] = function(...args) {
        window.stateTree = value.apply(this, args);
        notifyAll();
      }.bind(this)
    }.bind(this));

    component.prototype.updaters = appliedUpdaters
  }

  component.prototype.componentWillMount = function() {
    let currentOwner = this
    let ownerStack = [currentOwner.name]

    while (currentOwner.context.owner) {
      ownerStack.unshift(currentOwner.context.owner.name)
      currentOwner = currentOwner.context.owner
    }

    let tree = window.stateTree
    let parent, childName;

    this.ownerStack = ownerStack;

    tree = tree.withMutations((tree) => {
      tree.mergeIn(ownerStack, this.getStatifyProps(this.__getStateTree()))
    })

    window.stateTree = tree

    if (this.__componentDidMount) {
      this.__componentDidMount();
    }
  }

  return StatifiedComposer(component, getState)
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
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    registerListener(this);
  }

  onUpdate() {
    this.forceUpdate();
  }

  render() {
    window.provider = this;
    let child = Children.only(this.props.children)
    return React.cloneElement(child, {stateTree: window.stateTree})
  }
}


export {StatifyProvider, stateTree, curriedStatify as statify}
