module.exports = function(app, passport) {

  //homepage
  app.get('/', function(req, res) {
    console.log(req);
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      console.log('IT WORKED');
    }
    res.sendFile(__dirname + '/index.html');
  });

  app.post('/api/signup', passport.authenticate('local-signup', function(err, res, req) {
    req.res.send(req.body);
  }));


  app.post('/api/session', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
      if (err) { return next(err); }

      req.login(user, function(err) {
        if (err) {
          return res.status(401).json(err);
        } else {
          console.log(req.isAuthenticated());
          res.send(user.local);
        }
      });

    })(req, res, next);
  });

  app.get('/api/session', function(req, res) {
      req.session.destroy( () => {
        req.logout();
        res.send();
      });
  });

  function isLoggedIn(req, res, next) {
    // if the user is authenticated in the session, carryon

    if (req.isAuthenticated()) {
      res.redirect('/hello');
      return next();
    }

    // if they aren't redirect them to the homepage
    // res.redirect('/');
    return next();
  }
};
