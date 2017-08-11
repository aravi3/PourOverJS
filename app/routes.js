let localStorage = require('local-storage');
let User = require('../app/models/user');

module.exports = function(app, passport) {

  //homepage
  app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
  });

  app.get('/refresh', function(req, res) {

    if (localStorage.get('username')) {
      res.send({username: localStorage.get('username')});
    }
  });

  app.post('/api/signup', passport.authenticate('local-signup', function(err, user, req) {
    req.res.send(req.body);
  }));

  app.post('/api/session', passport.authenticate('local-login', function(err, user, req) {
    req.res.send(req.body);
  }));

  app.get('/api/session', function(req, res) {
    req.session.destroy( () => {
      req.logout();
      localStorage.set('username', null);
      res.send();
    });
  });

  app.post('/api/code', function(req, res) {
    let username = localStorage.get('username');
    let body = req.body;

    User.update({ 'local.username': username },
    { $push: { [body.filename]: body.code } },
    function(err, user) {
      if (err) {

      }
    });
  });

  app.patch('/api/code', function(req, res) {
    let username = localStorage.get('username');

    User.findOneAndUpdate({ 'local.username': username }, function(err, user) {

    });
  });

  app.delete('/api/code', function(req, res) {
    let username = localStorage.get('username');
  });
};
