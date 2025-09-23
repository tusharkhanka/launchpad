const express = require('express');
const UserController = require('./user.controller');
const ValidateRequestErrors = require('../../utils/validateRequestMiddlewares');
const RequestWrapper = require('../../utils/requestWrapper');
const validations = require('./user.validation');
const router = express.Router();

// router.post(
//   '/sso',
//   validations.validateSSO(),
//   ValidateRequestErrors(),
//   RequestWrapper(AuthController.
//   )
// );

router.get(
    '/',
    ValidateRequestErrors(),
    RequestWrapper(UserController.getAllUsers)
);


module.exports = router;
