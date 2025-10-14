const express = require('express');
const EnvironmentController = require('./environment.controller');
const ValidateRequestErrors = require('../../utils/validateRequestMiddlewares');
const RequestWrapper = require('../../utils/requestWrapper');
const validations = require('./environment.validation');

const router = express.Router({ mergeParams: true });

// Create environment under organisation
router.post(
  '/',
  validations.createUnderOrg(),
  ValidateRequestErrors(),
  RequestWrapper(EnvironmentController.create)
);

// List environments by organisation
router.get(
  '/',
  validations.listByOrganisation(),
  ValidateRequestErrors(),
  RequestWrapper(EnvironmentController.listByOrganisation)
);

// Get environment stats for organisation
router.get(
  '/stats',
  validations.getStats(),
  ValidateRequestErrors(),
  RequestWrapper(EnvironmentController.getStats)
);

module.exports = router;
