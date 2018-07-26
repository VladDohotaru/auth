'use strict';

const {
  dummyChain: transform,
} = require('./index.js');
/**
 * @see {@link https://github.com/salesforce/tough-cookie#properties}
 * @typedef {Object} CookieDefinition
 * @property {String} [key] cookie name
 * @property {String} value cookie value
 * @property {Date} expires cookie expires
 * @property {Number} maxAge cookie max age in seconds
 * @property {String} domain cookie domain
 * @property {String} path cookie path
 * @property {Boolean} secure cookie secure flag
 * @property {Boolean} httpOnly cookie httpOnly flag
 */
/**
 * @typedef {Object} RequestResponse
 * @property {Object} headers
 * @property {Number} StatusCode
 * @property {Object} cookies
 * @property {Object|String} body
 */
/**
 * @typedef {Object} RequestError
 * @property {String} name
 * @property {Number} statusCode
 * @property {String} message
 * @property {String} error
 * @property {Object} options input options
 * @property {RequestResponse} response
 */

const defaultRequest = require('request-promise-native');
const {
  fromJSON: defaultCookieFromJson,
} = require('tough-cookie');

const defaultMaxAge = 1800; // seconds

/**
 * Request class
 */
class Request {
  /**
   * @param {Object} request request library
   * @param {Object} cookieFromJSON create cookie from JSON
   */
  constructor({
    request = defaultRequest,
    cookieFromJSON = defaultCookieFromJson,
  } = {}) {
    this.request = request;
    this.cookieFromJSON = cookieFromJSON;
  }

  /**
   * make a http request
   * @param {String} [method='GET'] method used for http request
   * @param {Boolean} [json=true] parse response as json
   * @param {Object} [headers={}] optional headers for request
   * @param {Object} [cookies={}] optional cookies for request
   * @param {Object} [body] request body
   * @param {String} url url where to make http request
   * @param {Object} [qs={}] optional query string for request
   * @param {Object} rest optional parameters
   * @returns {Promise.<RequestResponse|RequestError>} resolves on success
   */
  async makeRequest({
    method = 'GET',
    json = true,
    headers = {},
    body,
    cookies = {},
    url,
    qs = {},
    ...rest
  }) {
    try {
      const jar = this.request.jar();
      Object.entries(cookies)
        .forEach(([key, value]) => {
          jar.setCookie(this.cookieFromJSON(Object.assign(
            {
              key,
              maxAge:   defaultMaxAge,
              expires:  new Date(Date.now() + (defaultMaxAge * 1000)),
              domain:   '',
              path:     '/',
              secure:   true,
              httpOnly: true,
            },
            value,
          )), url);
        });
      return this.request(Object.assign(
        {
          url,
          method,
          headers,
          body,
          json,
          qs,
        },
        rest,
        {
          jar,
          transform: async (responseBody, fullResponse) => ({
            headers:    fullResponse.headers,
            statusCode: fullResponse.statusCode,
            cookies:    this.getCookies(jar.getCookies(url)),
            body:       responseBody,
          }),
        },
      ));
    } catch (e) {
      // @todo redecorate error if needed
      throw e;
    }
  }

  /**
   * get default keys for a request
   * @param {String} [method='GET'] method
   * @param {Object|Buffer|String} [body={}] body if json is true it must be an object
   * @param {Object} [headers ={}] headers
   * @param {Object} [cookies={}] cookies
   * @param {Boolean} [json=true] json
   * @param {Object} {qs={}} qs
   * @param {String} url url
   * @returns {Object} object ready for request
   */
  getDefaultRequestObject({ // eslint-disable-line class-methods-use-this
    method = 'GET',
    body = {},
    headers = {},
    cookies = {},
    json = true,
    qs = {},
    url,
  }) {
    return {
      method,
      body,
      headers,
      cookies,
      json,
      qs,
      url,
    };
  }

  /**
   * getCookies
   * @param {String[]} cookies raw cookies
   * @returns {Object} parsed cookies
   * @private
   */
  getCookies(cookies) { // eslint-disable-line class-methods-use-this
    return cookies
      .map(c => c.toJSON())
      .reduce(
        (acc, { key, ...rest }) => Object.assign(
          {},
          acc,
          {
            [key]: rest,
          }
        ),
        {}
      );
  }
}


module.exports = {
  Request,
};
