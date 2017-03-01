var config = require('../config');
var mongoose = require('mongoose');
var gracefulShutdown;
var dbURI = config.db.local;

if (process.env.NODE_ENV == 'production') {
  dbURI = config.db.remote;
}
else if (process.env.NODE_ENV == 'test') {
  dbURI = config.db.test;
}

mongoose.connect(dbURI);

//CONNECTION EVENTS
mongoose.connection.on('connected', function() {
  console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err) {
  console.error('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function() {
  console.log('Mongoose disconnected');
});

//CAPTURE APP TERMINATION / RESTART EVENTS
//to be called when process is restarted or terminated
gracefulShutdown = function(msg, callback) {
  mongoose.connection.close(function() {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};
//for nodemon restarts
process.once('SIGUSR2', function() {
  gracefulShutdown('nodemon restart', function() {
    process.kill(process.pid, 'SIGUSR2');
  });
});
//for app termination
process.on('SIGINT', function() {
  gracefulShutdown('app termination', function() {
    process.exit(0);
  });
});
//for Heroku app termination
process.on('SIGTERM', function() {
  gracefulShutdown('Heroku app termination', function() {
    process.exit(0);
  });
});

//BRING IN YOUR SCHEMAS & MODELS
require('./userModel');
