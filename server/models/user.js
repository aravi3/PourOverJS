const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
	username: { type: String, required: true, unique: true, lowercase: true },
	password: { type: String, required: true },
});

UserSchema.pre('save', function(next){
	const user = this;

	if (this.isModified('password') || this.isNew) {
	bcrypt.genSalt(10)
		.then((salt) => {
			bcrypt.hash(user.password, salt)
				.then((hash) => {
				user.password = hash;
				next();
			})
			.catch(hashErr => next(hashErr));
		})
		.catch(saltErr => next(saltErr));
		}
	});

UserSchema.methods.isProperPassword = function(clientPassword){
	return new Promise((resolve, reject) => {
		bcrypt.compare(clientPassword, this.password)
			.then((res) => {
				resolve(res);
			})
			.catch((compareError) => {
				console.log(compareError);
				console.log('Error in bcryptCompare');
				reject(compareError);
			});
	});
}

module.exports = mongoose.model('User', UserSchema);
