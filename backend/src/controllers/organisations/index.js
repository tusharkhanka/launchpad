const express = require('express');
const OrgController = require('./organisations.controller');
const ValidateRequestErrors = require('../../utils/validateRequestMiddlewares');
const RequestWrapper = require('../../utils/requestWrapper');
const validations = require('./organisations.validation');

const router = express.Router();

router.post(
  '/',
  validations.createOrganisation(),
  ValidateRequestErrors(),
  RequestWrapper(OrgController.create)
);

router.get(
  '/:id',
  validations.byId(),
  ValidateRequestErrors(),
  RequestWrapper(OrgController.getById)
);

router.put(
  '/:id',
  validations.updateOrganisation(),
  ValidateRequestErrors(),
  RequestWrapper(OrgController.update)
);

router.delete(
  '/:id',
  validations.byId(),
  ValidateRequestErrors(),
  RequestWrapper(OrgController.remove)
);

module.exports = router;

