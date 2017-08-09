const { secret } = require('../config/config');
const User = require('../models/user');
const JwtStrategy = require('passport-jwt').Strategy,
	ExtractJwt = require('passport-jwt').ExtractJwt;

function initPassport(passport){
	const opts = {};
	opts.jwtFromRequest = ExtractJwt.fromHeader('authorization');
	opts.secretOrKey = secret;

	passport.use(new JwtStrategy(opts, (payload, done) => {
		User.findById(payload.sub)
			.then((user) => {
				return user
				? done(null, user)
				: done(null, false);
			})
			.catch(error => done(error, false));
	}));
}

module.exports = initPassport;