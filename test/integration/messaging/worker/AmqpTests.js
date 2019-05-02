'use strict';

const getConnectionOptions = require('../../../shared/getConnectionOptions'),
      getTestsFor = require('./getTestsFor'),
      { AmqpDispatcher, AmqpWorker } = require('../../../../messaging/worker');

suite('Amqp', () => {
  getTestsFor({
    Dispatcher: AmqpDispatcher,
    Worker: AmqpWorker,

    getOptions () {
      const { rabbitMq } = getConnectionOptions({ type: 'integration' });

      return rabbitMq;
    }
  });
});
