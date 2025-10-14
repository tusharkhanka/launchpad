const express = require('express');
const CloudAccountController = require('./cloudAccount.controller');
const ValidateRequestErrors = require('../../utils/validateRequestMiddlewares');
const RequestWrapper = require('../../utils/requestWrapper');
const validations = require('./cloudAccount.validation');

const router = express.Router();

// Create cloud account
router.post(
  '/',
  validations.createCloudAccount(),
  ValidateRequestErrors(),
  RequestWrapper(CloudAccountController.create)
);

// List all cloud accounts
router.get(
  '/',
  RequestWrapper(CloudAccountController.list)
);

// List cloud accounts by organisation
router.get(
  '/organisation/:orgId',
  validations.listByOrganisation(),
  ValidateRequestErrors(),
  RequestWrapper(CloudAccountController.listByOrganisation)
);

// Get cloud account by ID
router.get(
  '/:id',
  validations.byId(),
  ValidateRequestErrors(),
  RequestWrapper(CloudAccountController.getById)
);

// Update cloud account
router.put(
  '/:id',
  validations.updateCloudAccount(),
  ValidateRequestErrors(),
  RequestWrapper(CloudAccountController.update)
);

// Delete cloud account
router.delete(
  '/:id',
  validations.byId(),
  ValidateRequestErrors(),
  RequestWrapper(CloudAccountController.remove)
);

// Test cloud account connection
router.post(
  '/test-connection',
  validations.testConnection(),
  ValidateRequestErrors(),
  RequestWrapper(CloudAccountController.testConnection)
);

// List VPCs for a cloud account
router.get(
  '/:id/vpcs',
  validations.byId(),
  ValidateRequestErrors(),
  RequestWrapper(CloudAccountController.listVpcs)
);

module.exports = router;
