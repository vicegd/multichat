var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jwt-simple');
var moment = require('moment');

var userSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  hash: String,
  salt: String
});

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
  var payload = {
    sub: {
      _id: this._id,
      userName: this.userName,
      name: this.name
    },
    iat: moment().unix(),
    exp: moment().add(14, "days").unix()
  };

  return jwt.encode(payload, process.env.JWT_SECRET);
};

mongoose.model('User', userSchema);
