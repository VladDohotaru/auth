'use strict';

const { Request } = require('./Request');
const { dummyChain } = require('./utilities');

const instances = {
  request: null,
};
/**
 * getRequest instance
 * @param {Object[]} args Request constructor arguments
 * @returns {Request} request singleton instance
 */
const getRequestInstance = (...args) => {
  if (instances.request === null) {
    instances.request = Reflect.construct(Request, args);
  }
  return instances.request;
};

module.exports = {
  Request,
  getRequestInstance,
  dummyChain,
};
