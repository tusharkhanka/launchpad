const express = require('express');
const ValidateRequestErrors = require('../../utils/validateRequestMiddlewares');
const RequestWrapper = require('../../utils/requestWrapper');
const validations = require('./environments.validation');
const Controller = require('./environments.controller');

const router = express.Router();

router.post(
  '/:orgId/environments',
  validations.createUnderOrg(),
  ValidateRequestErrors(),
  RequestWrapper(Controller.createUnderOrg)
);

router.get(
  '/:orgId/environments',
  validations.listUnderOrg(),
  ValidateRequestErrors(),
  RequestWrapper(Controller.listUnderOrg)
);

module.exports = router;

