module.exports = function(app, passport) {

  //homepage
  app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
  });

  app.post('/api/signup', function(req, res, next) {
    console.log(next);
    passport.authenticate('local-signup', function(err, user, info) {
      if (err) { return next(err); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.send(req.body);
      });
    })(req, res, next);
  });

  app.post('/api/session', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return { message: req.flash('loginMessage')}; }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.send(req.body);
      });
    })(req, res, next);
  });

  app.get('/api/session', function(req, res) {
    req.session.destroy( () => {
      req.logout();
      res.send(req.body);
    });
  });

  function isLoggedIn(req, res, next) {

    // if the user is authenticated in the session, carryon

    if (req.isAuthenticated()) {
      return next();
    }

    // if they aren't redirect them to the homepage
    res.redirect('/');
  }
};
