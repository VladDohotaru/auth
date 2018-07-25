'use strict';

const config = require('../config.js');
const jwt = require("jsonwebtoken");

function createToken (content) {
  return jwt.sign(content, config.get('JWT.TOKEN_SECRET_KEY'), {
    algorithm: config.get('JWT.TOKEN_ALGORITHM'),
    expiresIn: config.get('JWT.TOKEN_EXPIRATION'),
    issuer:    config.get('JWT.TOKEN_ISSUER')
  });
}

function verify (token) {
  return jwt.verify(token, config.get('JWT.TOKEN_SECRET_KEY'), {
    issuer: config.get('JWT.TOKEN_ISSUER')
  });
}
module.exports = {
  createToken,
  verify,
}
