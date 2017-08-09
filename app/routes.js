let localStorage = require('local-storage');

module.exports = function(app, passport) {

  //homepage
  app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
  });

  app.get('/refresh', function(req, res) {

    if (localStorage.get('username')) {
      res.send({username: localStorage.get('username')});
    }
  })

  app.post('/api/signup', passport.authenticate('local-signup', function(err, res, req) {
    req.res.send(req.body);
  }));

  app.post('/api/session', passport.authenticate('local-login', function(err, res, req) {
    req.res.send(req.body);
  }));

  app.get('/api/session', function(req, res) {
    req.session.destroy( () => {
      req.logout();
      localStorage.set('username', null);
      res.send();
    });
  });

  //
  // function isLoggedIn(req, res, next) {
  //   // if the user is authenticated in the session, carryon
  //
  //   if (req.isAuthenticated()) {
  //     res.redirect('/hello');
  //     return next();
  //   }
  //
  //   // if they aren't redirect them to the homepage
  //   // res.redirect('/');
  //   return next();
  // }
};
