var config = {};

config.db = {}; //MongoDB database

config.db.local = 'mongodb://localhost/multichat';
config.db.test = 'mongodb://localhost/multichat_test';
config.db.remote = process.env.MONGO_URI;

module.exports = config;
