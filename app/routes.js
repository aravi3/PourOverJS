module.exports = function(app, passport) {

  //homepage
  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  //login page
  app.get('/login', function(req, res) {
    res.render('login.ejs', {message : req.flash('loginMessage')});
  });

  //signup page
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', {message : req.flash('signupMessage')});
  });

  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user: req.user
    });
  });

  app.get('/logout', function(req, res) {
    req.logout();
    req.redirect('/');
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    faliureFlash: true
  }));

  function isLoggedIn(req, res, next) {

    // if the user is authenticated in the session, carryon

    if (req.isAuthenticated()) {
      return next();
    }

    // if they aren't redirect them to the homepage
    res.redirect('/');
  }
};
