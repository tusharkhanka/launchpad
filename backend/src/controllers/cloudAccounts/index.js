const express = require('express');
const ValidateRequestErrors = require('../../utils/validateRequestMiddlewares');
const RequestWrapper = require('../../utils/requestWrapper');
const validations = require('./cloudAccounts.validation');
const Controller = require('./cloudAccounts.controller');

const router = express.Router();

router.get(
  '/:id',
  validations.byId(),
  ValidateRequestErrors(),
  RequestWrapper(Controller.getById)
);

router.put(
  '/:id',
  validations.updateCloudAccount(),
  ValidateRequestErrors(),
  RequestWrapper(Controller.update)
);

router.delete(
  '/:id',
  validations.byId(),
  ValidateRequestErrors(),
  RequestWrapper(Controller.remove)
);

module.exports = router;

