let LocalStrategy = require("passport-local").Strategy;

let User = require('../app/models/user');

let localStorage = require('local-storage');

module.exports = function(passport) {

  passport.use('local-signup', new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, username, password, done) {
      process.nextTick(function() {
        User.findOne({ 'local.username': username }, function(err, user) {
          if (err) {
            return done(err);
          }
          if (user) {
            return done(null, false, req.flash('signupMessage', "Username already taken"));
          } else {
            let newUser = new User();
            newUser.local.username = username;
            newUser.local.password = newUser.generateHash(password);

            localStorage.set('username', newUser.local.username);

            newUser.save( function(saveErr) {
              if (saveErr) {
                throw saveErr;
              }
              return done(null, newUser, req);
            });
          }
        });
      });
    })
  );

  passport.use('local-login', new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, username, password, done) {
      User.findOne({ 'local.username': username }, function(err, user) {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false, req.flash('loginMessage', 'No user found'));
        }

        if (!user.validPassword(password)) {
          return done(null, false, req.flash('loginMessage', 'Invalid credentials'));
        }

        localStorage.set('username', user.local.username);

        return done(null, user, req);
      });
    })
  );
};
