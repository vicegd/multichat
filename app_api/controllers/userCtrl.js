var passport = require('passport');
var mongoose = require('mongoose');
var utils = require('../utils/utils');
var User = mongoose.model('User');
require('../config/passport.js');

module.exports.register = function(req, res) {
  if(!req.body.userName || !req.body.name || !req.body.password) {
    utils.sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }

  var user = new User();
  user.userName = req.body.userName;
  user.name = req.body.name;
  user.setPassword(req.body.password);

  user.save(function(err) {
    var token;
    if (err) {
      utils.sendJSONresponse(res, 500, err);
    } else {
      token = user.generateJwt();
      utils.sendJSONresponse(res, 200, {
        "token" : token
      });
    }
  });
};

module.exports.login = function(req, res) {
  if (!req.body.userName || !req.body.password) {
    utils.sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }

  passport.authenticate('local', function(err, user, info) {
    var token;

    if (err) {
      utils.sendJSONresponse(res, 404, err);
      return;
    }

    if (user) {
      token = user.generateJwt();
      utils.sendJSONresponse(res, 200, {
        "token": token
      });
    } else {
      utils.sendJSONresponse(res, 401, info);
    }
  })(req, res);
};

module.exports.profile = function(req, res) {
  User.find({userName: req.body.userName}, function (err, docs) {
    if (err) {
      utils.sendJSONresponse(res, 500, err); //Internal server error
    }
    else if (docs.length > 0) {
      var user = docs[0]; //user exists
      console.log(user._id);

      if (req.body.name != user.name)
        user.name = req.body.name;
      if (req.body.password)
        user.setPassword(req.body.password);
      User.update({userName: req.body.userName}, user, function(err) {
        var token;
        if (err) {
          utils.sendJSONresponse(res, 500, err); //Error
        } else {
          token = user.generateJwt();
          utils.sendJSONresponse(res, 200, { //OK
            "token": token
          });
        }
      });
    }
    else {
      utils.sendJSONresponse(res, 404, ""); //No content => Error
    }
  })
};

module.exports.users = function(req, res) {
  User.find({ userName: req.params.userId}, function(err, docs) {
    if (err)
      utils.sendJSONresponse(res, 500, err); //Internal server error
    else if (docs.length > 0)
      utils.sendJSONresponse(res, 200, docs); //200 OK
    else
      utils.sendJSONresponse(res, 204, ""); //204 No Content
  })
};

module.exports.delete = function(req, res){
  User.findOneAndRemove({ userName: req.params.userId}, function(err){
    if (err) {
      utils.sendJSONresponse(res, 500, err); //Internal server error
    }
    else {
      utils.sendJSONresponse(res, 200, ""); //OK
    }
  });
};
