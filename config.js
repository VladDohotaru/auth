'use strict';

const convict = require('convict');

const config = convict({
    SERVER: {
        PORT: {
            format: "port",
            required: true,
            default: 8080
        },
    },
    FACEBOOK: {
        FACEBOOK_APP_ID: {
            // format: String,
            required: true
        },
        FACEBOOK_SECRET_KEY: {
            // format: String,
            required: true
        },
        FACEBOOK_API: {
            require: true
        },
        FACEBOOK_VERSION: {
            require: true
        },
        FACEBOOK_FIELDS: {
            require: true
        }
    },
    JWT: {
        TOKEN_SECRET_KEY: {
            // format: String,
            required: true,
        },
        TOKEN_EXPIRATION: {
            // format: String,
            required: true,
        },
        TOKEN_ISSUER: {
            // format: String,
            required: true,
        },
        TOKEN_ALGORITHM: {
            // format: String,
            required: true,
        }
    },
});
config.loadFile(['./config/config.json']);
// config.validate({allowed: 'strict'});
module.exports = config;