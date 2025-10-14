const express = require('express');
const RoleController = require('./role.controller');
const ValidateRequestErrors = require('../../utils/validateRequestMiddlewares');
const RequestWrapper = require('../../utils/requestWrapper');
const validations = require('./role.validation');

const router = express.Router();

router.post(
  '/',
  validations.createRole(),
  ValidateRequestErrors(),
  RequestWrapper(RoleController.create)
);

router.get(
  '/',
  RequestWrapper(RoleController.list)
);

router.get(
  '/:id',
  validations.byId(),
  ValidateRequestErrors(),
  RequestWrapper(RoleController.getById)
);

router.put(
  '/:id',
  validations.updateRole(),
  ValidateRequestErrors(),
  RequestWrapper(RoleController.update)
);

router.delete(
  '/:id',
  validations.byId(),
  ValidateRequestErrors(),
  RequestWrapper(RoleController.remove)
);

module.exports = router;

