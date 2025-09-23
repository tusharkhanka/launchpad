const express = require('express');
const ValidateRequestErrors = require('../../utils/validateRequestMiddlewares');
const RequestWrapper = require('../../utils/requestWrapper');
const validations = require('./environments.validation');
const Controller = require('./environments.controller');

const router = express.Router();

router.get(
  '/:id',
  validations.byId(),
  ValidateRequestErrors(),
  RequestWrapper(Controller.getById)
);

router.put(
  '/:id',
  validations.updateEnvironment(),
  ValidateRequestErrors(),
  RequestWrapper(Controller.update)
);

router.delete(
  '/:id',
  validations.byId(),
  ValidateRequestErrors(),
  RequestWrapper(Controller.remove)
);

// Operational endpoints (provision/destroy/status)
router.post(
  '/:id/provision',
  validations.byId(),
  ValidateRequestErrors(),
  RequestWrapper(Controller.provision)
);

router.post(
  '/:id/destroy',
  validations.byId(),
  ValidateRequestErrors(),
  RequestWrapper(Controller.destroy)
);

router.get(
  '/:id/status',
  validations.byId(),
  ValidateRequestErrors(),
  RequestWrapper(Controller.status)
);

module.exports = router;

