const express = require('express');

const router = express.Router();

const UsersController = require('../controller/users.js');


//READ
router.get('/', UsersController.getAllUsers);


module.exports = router;