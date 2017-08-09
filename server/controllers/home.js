const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.getHomePage = (req, res, next) => {
	console.log(req.user);
	res.send({ message: 'Home page' });
}