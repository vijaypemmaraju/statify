import PropTypes from 'prop-types'
import React, { Component, Children } from 'react';
import { Map } from 'immutable'

const Statify = {stateTree: new Map()}
window.Statify = Statify

const StatifiedComposer = (StatifiedComponent, getState) => class StatifiedComponentWrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {ready: false};
  }
  componentDidMount() {
    this.setState({ ready: true });
  }
  render() {
    return this.state.ready && <StatifiedComponent {...Object.assign(getState.call(this, Statify.stateTree, this.props), this.props)} />
  }
};

// Class Decorator
const statify = function (component, getState, updaters) {
  component.contextTypes = {owner: PropTypes.any}
  component.childContextTypes = {owner: PropTypes.any}
  component.prototype.__getStateTree = () => Statify.stateTree


  component.prototype.getChildContext = function () {
    return {owner: this}
  }

  component.prototype.name = component.name

  component.prototype.__componentWillMount = component.prototype.componentWillMount

  component.prototype.getStatifyProps = getState

  if (updaters) {
    let appliedUpdaters = updaters(() => Statify.stateTree)
    Object.entries(appliedUpdaters).forEach(function([key, value]) {
      appliedUpdaters[key] = function(...args) {
        value.apply(appliedUpdaters, args).then((stateTree) => {
          Statify.stateTree = stateTree;
          notifyAll();
        })
      }
    })

    component.prototype.updaters = appliedUpdaters
  }

  component.prototype.componentWillMount = function() {
    let currentOwner = this
    let postfix = ''
    let key = this._reactInternalInstance._currentElement._owner._currentElement.key
    let ownerStack = [currentOwner.name+postfix]
    if (key) {
      ownerStack.push(key);
    }

    while (currentOwner.context.owner) {
      ownerStack.unshift(currentOwner.context.owner.name)
      currentOwner = currentOwner.context.owner
    }

    let tree = Statify.stateTree

    this.ownerStack = ownerStack;

    tree = tree.withMutations((tree) => {
      tree.mergeIn(ownerStack, this.getStatifyProps(this.__getStateTree(), this.props))
    })

    Statify.stateTree = tree

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
  componentDidMount() {
    registerListener(this);
  }

  onUpdate() {
    this.forceUpdate();
  }

  render() {
    window.provider = this;
    let child = Children.only(this.props.children)
    return React.cloneElement(child, {stateTree: Statify.stateTree})
  }
}

let stateTree = Statify.stateTree
export {StatifyProvider, stateTree, curriedStatify as statify}
