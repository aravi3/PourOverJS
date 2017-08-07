let LocalStrategy = require("passport-local").Strategy;

let User = require('../app/models/user');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
       done(null, user.id);
   });

  passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
          done(err, user);
      });
  });

  passport.use('local-signup', new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallBack: true
    },
      function(req, username, password, done) {
        process.nextTick(function() {
          User.findOne({ 'local.username': username }, function(err, user) {
            if (err) {
              return done(err);
            }
            if (user) {
              return done(null, false, req.flash('signupMessage', 'Username already taken'));
            } else {
              let newUser = new User();
              newUser.local.username = username;
              newUser.local.password = newUser.generateHash(password);

              newUser.save( function(saveErr) {
                if (saveErr) {
                  throw saveErr;
                }
                return done(null, newUser);
              });
            }
          });
        });
    })
  );

};
