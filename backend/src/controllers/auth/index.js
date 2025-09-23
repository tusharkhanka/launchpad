const express = require('express');
const AuthController = require('./auth.controller');
const ValidateRequestErrors = require('../../utils/validateRequestMiddlewares');
const RequestWrapper = require('../../utils/requestWrapper');
const validations = require('./auth.validation');
const router = express.Router();

router.post(
  '/sso',
//   validations.validateSSO(),
  ValidateRequestErrors(),
  RequestWrapper(AuthController.sso)
);

router.post(
    '/signup',
    // validations.validateSignup(),
    ValidateRequestErrors(),
    RequestWrapper(AuthController.register)
);

router.post(
    '/login',
    ValidateRequestErrors(),
    RequestWrapper(AuthController.login)
);

router.post(
    '/logout',
    ValidateRequestErrors(),
    RequestWrapper(AuthController.logout)
)

module.exports = router;
