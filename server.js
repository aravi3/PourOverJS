let express = require('express');
let app = express();
let port = process.env.PORT || 8080;
let mongoose = require('mongoose');
let passport = require('passport');
let flash = require('connect-flash');

let morgan = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);

let configDB = require('./config/database.js');

mongoose.connect(configDB.url, { useMongoClient: true });

require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(cookieParser('ilovebcrypt'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.use(session({
  secret: 'ilovebcrypt',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 360000
  },
  store: new MongoStore({
    url: configDB.url,
    collection: 'sessions'
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes.js')(app, passport);

app.listen(port);
console.log('The magic happens on port' + port);
