'use strict';

const convict = require('convict');

const config = convict({
    server: {
        port: {
            format: "port",
            required: true,
            default: 8080
        },
    },
    passport: {
        clientID: {
            // format: String,
            required: true
        },
        clientSecret: {
            // format: String,
            required: true
        },
        callbackURL: {
            // format: String,
            required: true
        },
    },
    dataBase: {
        name: {
            // format: String,
            required: true,
        },
        username: {
            // format: String,
            required: true,
        },
        password: {
            // format: String,
            required: true,
        },
    },
});
config.loadFile(['./config/config.json']);
// config.validate({allowed: 'strict'});
module.exports = config;