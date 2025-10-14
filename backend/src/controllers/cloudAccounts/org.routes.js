const express = require('express');
const CloudAccountController = require('./cloudAccount.controller');
const ValidateRequestErrors = require('../../utils/validateRequestMiddlewares');
const RequestWrapper = require('../../utils/requestWrapper');
const validations = require('./cloudAccount.validation');

const router = express.Router({ mergeParams: true });

// Create cloud account under organisation
router.post(
  '/',
  validations.createUnderOrg(),
  ValidateRequestErrors(),
  RequestWrapper(CloudAccountController.create)
);

// List cloud accounts for organisation
router.get(
  '/',
  validations.listByOrganisation(),
  ValidateRequestErrors(),
  RequestWrapper(CloudAccountController.listByOrganisation)
);

module.exports = router;
