const express = require('express');
const ValidateRequestErrors = require('../../utils/validateRequestMiddlewares');
const RequestWrapper = require('../../utils/requestWrapper');
const validations = require('./cloudAccounts.validation');
const Controller = require('./cloudAccounts.controller');

const router = express.Router();

router.post(
  '/:orgId/cloud-accounts',
  validations.createUnderOrg(),
  ValidateRequestErrors(),
  RequestWrapper(Controller.createUnderOrg)
);

router.get(
  '/:orgId/cloud-accounts',
  validations.listUnderOrg(),
  ValidateRequestErrors(),
  RequestWrapper(Controller.listUnderOrg)
);

module.exports = router;

