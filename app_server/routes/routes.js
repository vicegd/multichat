var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/controllers');
var middleware = require('./middleware');

router.get('/', middleware.detectAuthenticated, ctrlMain.index);
router.get('/about', middleware.detectAuthenticated, ctrlMain.about);
router.get('/index', middleware.detectAuthenticated, ctrlMain.index);
router.get('/login', middleware.detectAuthenticated, ctrlMain.login);
router.get('/logout', middleware.isAuthenticated, ctrlMain.logout);
router.get('/profile', middleware.isAuthenticated, ctrlMain.profile);
router.get('/register', middleware.detectAuthenticated, ctrlMain.register);
router.get('/multichat', middleware.isAuthenticated, ctrlMain.multichat);

module.exports = router;

