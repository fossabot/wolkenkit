'use strict';

const cloneDeep = require('lodash/cloneDeep');

class ReadableAggregate {
  constructor ({ application, context, aggregate }) {
    if (!application) {
      throw new Error('Application is missing.');
    }
    if (!context) {
      throw new Error('Context is missing.');
    }
    if (!context.name) {
      throw new Error('Context name is missing.');
    }
    if (!aggregate) {
      throw new Error('Aggregate is missing.');
    }
    if (!aggregate.name) {
      throw new Error('Aggregate name is missing.');
    }
    if (!aggregate.id) {
      throw new Error('Aggregate id is missing.');
    }

    if (!application.initialState.internal[context.name]) {
      throw new Error('Context does not exist.');
    }
    if (!application.initialState.internal[context.name][aggregate.name]) {
      throw new Error('Aggregate does not exist.');
    }

    this.instance = {};
    this.instance.context = { name: context.name };
    this.instance.name = aggregate.name;
    this.instance.id = aggregate.id;
    this.instance.revision = 0;
    this.instance.uncommittedEvents = [];
    this.instance.exists = () =>
      this.instance.revision > 0;

    this.api = {};
    this.api.forReadOnly = {};
    this.api.forReadOnly.id = aggregate.id;
    this.api.forReadOnly.state =
      cloneDeep(application.initialState.internal[context.name][aggregate.name]);
    this.api.forReadOnly.exists = this.instance.exists;

    this.api.forEvents = {};
    this.api.forEvents.id = this.api.forReadOnly.id;
    this.api.forEvents.state = this.api.forReadOnly.state;
    this.api.forEvents.setState = newState => {
      for (const [ key, value ] of Object.entries(newState)) {
        this.api.forEvents.state[key] = value;
      }
    };
  }

  applySnapshot (snapshot) {
    if (!snapshot) {
      throw new Error('Snapshot is missing.');
    }

    this.instance.revision = snapshot.revision;
    this.api.forReadOnly.state = snapshot.state;
    this.api.forEvents.state = snapshot.state;
  }
}

module.exports = ReadableAggregate;
