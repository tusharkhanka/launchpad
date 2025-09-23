const express = require('express');
const ValidateRequestErrors = require('../../utils/validateRequestMiddlewares');
const RequestWrapper = require('../../utils/requestWrapper');
const responseWrapper = require('../../utils/responseWrapper');
const validations = require('./environments.validation');

const router = express.Router();

const notImpl = (req, res) => responseWrapper.errorResponse(res, 501, 'Not implemented', {});

router.get(
  '/:id',
  validations.byId(),
  ValidateRequestErrors(),
  RequestWrapper(notImpl)
);

router.put(
  '/:id',
  validations.updateEnvironment(),
  ValidateRequestErrors(),
  RequestWrapper(notImpl)
);

router.delete(
  '/:id',
  validations.byId(),
  ValidateRequestErrors(),
  RequestWrapper(notImpl)
);

// Operational endpoints (provision/destroy/status)
router.post(
  '/:id/provision',
  validations.byId(),
  ValidateRequestErrors(),
  RequestWrapper(notImpl)
);

router.post(
  '/:id/destroy',
  validations.byId(),
  ValidateRequestErrors(),
  RequestWrapper(notImpl)
);

router.get(
  '/:id/status',
  validations.byId(),
  ValidateRequestErrors(),
  RequestWrapper(notImpl)
);

module.exports = router;

