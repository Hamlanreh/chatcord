const express = require('express');

const authController = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(authController.signup);

router.route('/user/:id').get(authController.getUser);

router.route('/getRoomUsers/:room').get(authController.getRoomUsers);

router.route('/deleteUser/:id').delete(authController.deleteUser);

module.exports = router;
