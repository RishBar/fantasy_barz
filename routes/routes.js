const express = require('express');
const router = express.Router();
const controllers = require('../controllers/authController.js');

router.get('/say-something', controllers.saySomething);

module.exports = router;