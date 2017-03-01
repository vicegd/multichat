var express = require('express');
var userCtrl = require('../controllers/userCtrl');
var router = express.Router();

//authentication
router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.put('/profile', userCtrl.profile);
router.get('/users/:userId', userCtrl.users);
router.delete('/delete/:userId', userCtrl.delete);

module.exports = router;
