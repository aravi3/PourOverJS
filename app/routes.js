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

    User.findOne({ username })
      .then( (user) => {
        user.codes.push(req.body);
        user.save();
        res.send(user.codes);
      });
  });

  app.patch('/api/code', function(req, res) {
    let username = localStorage.get('username');
    let newCode = req.body;

    User.findOne({ username })
      .then( (user) => {
        let index = user.codes.findIndex( (el) => el.filename == newCode.filename );

        if ( index > -1 ) {
          user.codes[index] = newCode;
          user.save();
          res.send(user.codes);
        }
      });
  });

  app.delete('/api/code', function(req, res) {
    let username = localStorage.get('username');
    let filenameToDelete = req.body;

    User.findOne({ username }).
      then( (user) => {
        let index = user.codes.findIndex( (el) => el.filename == filenameToDelete );

        if ( index > -1 ) {
          user.codes.splice(index, 1);
          user.save();
          res.send(user.codes);
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
