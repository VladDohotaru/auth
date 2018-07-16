'use strict';

const passport = require('passport-facebook');
const config = require('../config.js');
console.log(config)
passport.use(new FacebookStrategy({
    clientID:     config.get('passport.clientID'),
    clientSecret: config.get('passport.clientSecret'),
    callbackURL:  config.get('passport.callbackURL'),
  },
  function(accessToken, refreshToken, profile, cb) {
    // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    //   return cb(err, user);
    console.log('done');
    // });
  }
));


passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });