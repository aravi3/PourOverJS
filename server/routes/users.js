const express = require('express');
const Authentication = require('../controllers/auth/authentication');
const router = express.Router();

/* POST to Register or Login */
router.post('/register', Authentication.register);
router.post('/login', Authentication.login);

module.exports = router;