let bcrypt = require('bcrypt-nodejs');
let mongoose = require('mongoose');

let userSchema = mongoose.Schema({

  local: {
    username: String,
    password: String
  }

});

// generate hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//check if password valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
