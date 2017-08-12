let localStorage = require('local-storage');
let User = require('../app/models/user');

module.exports = function(app, passport) {

  //homepage
  app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
  });

  app.get('/refresh', function(req, res) {
    let username = localStorage.get('username');

    if (username) {
      User.findOne({ 'local.username': username }, function(err, user) {
        if(err) {
          res.send(err);
        } else {
          res.send(user);
        }
      });
    }
  });

  app.post('/api/signup', passport.authenticate('local-signup', function(err, user, req) {
    req.res.send(req.body);
  }));

  app.post('/api/session', passport.authenticate('local-login', function(err, user, req) {
    req.res.send(user);
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
    User.findOne({ 'local.username': username }, function(err, user) {
      user.local.code.push(req.body);
      user.save();
      res.send(user.local.code);
    });
  });

  app.patch('/api/code', function(req, res) {
    let username = localStorage.get('username');
    let newCode = req.body;

    User.findOne({ 'local.username': username }, function(err, user) {
      let index = user.local.code.findIndex( (el) => el.filename === newCode.filename );

      if ( index > -1 ) {
        user.local.code[index] = newCode;
      } else {
        user.local.code.push(newCode);
      }

      user.save();
      res.send(user.local.code);
    });
  });

  app.delete('/api/code', function(req, res) {
    let username = localStorage.get('username');
    let filenameToDelete = req.body.filename;

    User.findOne({ 'local.username': username }, function(err, user) {
      let index = user.local.code.findIndex( (el) => el.filename === filenameToDelete );

      if ( index > -1 ) {
        user.local.code.splice(index, 1);
      }
      user.save();
      res.send(user.local.code);
    });
  });

  app.delete('/api/code', function(req, res) {
    let username = localStorage.get('username');
  });
};
