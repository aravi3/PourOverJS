module.exports = function(app, passport) {

  //homepage
  app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
  });

  app.post('/api/signup', passport.authenticate('local-signup', function(err, res, req) {
    // console.log(err);
    // console.log(res);
    // console.log(req);
  }));

  app.post('/api/session', passport.authenticate('local-login', function(err, res, req) {
    // console.log(err);
    // console.log(res);
    // console.log(req);
  }));

  app.get('/api/session', function(req, res) {
    console.log(req.sessionID);
    req.logOut();
    console.log(req.sessionID);
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
