const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/config');
const passport = require('passport');
const cors = require('cors');

const users = require('./routes/users');

const app = express();
app.use(cors());

mongoose.Promise = global.Promise;
mongoose.connect(config.db);

const connection = mongoose.connection;
connection.on('open', () => { console.log('MongoDB Connected'); });
connection.on('error', error => console.log(error));

app.use(passport.initialize());
require('./services/passport.config')(passport);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use('/', todos);
app.use('/users', users);

app.set('port', (process.env.PORT || 8080));

app.listen(app.get('port'), function(){
	console.log('Server started on port ' + app.get('port'));
});

module.exports = app;
