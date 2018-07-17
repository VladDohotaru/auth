'use strict';

const express = require('express');
const config = require('./config.js');
const app = express();
const { passport } = require('./config/passport');



app.get('/', (req, res) => res.send('Hello World'));


app.get('/auth/facebook',
    passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
        function(req, res) {
            console.log('res', res)
            console.log('REQ', req)
        // Successful authentication, redirect home.
        res.redirect('/');
    });
app.get('/login', function(req, res) {
      res.render('login');
});

app.listen(config.get('server.port'), () => console.log('Started'));