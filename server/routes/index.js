const express = require('express');
const router = express.Router();
const Home = require('../controllers/home');

const passport = require('passport');

/* GET home page. */
const requireAuth = passport.authenticate('jwt', { session: false });

router.get('/home', requireAuth, Home.getHomePage);

module.exports = router;
