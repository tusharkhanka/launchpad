const express = require('express');
const EnvironmentController = require('./environment.controller');
const ValidateRequestErrors = require('../../utils/validateRequestMiddlewares');
const RequestWrapper = require('../../utils/requestWrapper');
const validations = require('./environment.validation');

const router = express.Router();

// Create environment
router.post(
  '/',
  validations.createEnvironment(),
  ValidateRequestErrors(),
  RequestWrapper(EnvironmentController.create)
);

// List all environments
router.get(
  '/',
  RequestWrapper(EnvironmentController.list)
);

// List environments by organisation
router.get(
  '/organisation/:orgId',
  validations.listByOrganisation(),
  ValidateRequestErrors(),
  RequestWrapper(EnvironmentController.listByOrganisation)
);

// List environments by cloud account
router.get(
  '/cloud-account/:cloudAccountId',
  validations.listByCloudAccount(),
  ValidateRequestErrors(),
  RequestWrapper(EnvironmentController.listByCloudAccount)
);

// Get environment by ID
router.get(
  '/:id',
  validations.byId(),
  ValidateRequestErrors(),
  RequestWrapper(EnvironmentController.getById)
);

// Update environment
router.put(
  '/:id',
  validations.updateEnvironment(),
  ValidateRequestErrors(),
  RequestWrapper(EnvironmentController.update)
);

// Delete environment
router.delete(
  '/:id',
  validations.byId(),
  ValidateRequestErrors(),
  RequestWrapper(EnvironmentController.remove)
);

// Get environment stats for organisation
router.get(
  '/stats/:orgId',
  validations.getStats(),
  ValidateRequestErrors(),
  RequestWrapper(EnvironmentController.getStats)
);

module.exports = router;
