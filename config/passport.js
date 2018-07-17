'use strict';

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const config = require('../config.js');
const { userMeta } = require('../models');

passport.use(new FacebookStrategy({
    clientID:     config.get('passport.clientID'),
    clientSecret: config.get('passport.clientSecret'),
    callbackURL:  config.get('passport.callbackURL'),
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(accessToken, 'ajungi aici vapshe')
    userMeta.findOrCreate({ facebookId: profile.id }, function (err, user) {
      console.log(err, "AICI")
      return cb(err, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  userMeta.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = {
  passport,
}




