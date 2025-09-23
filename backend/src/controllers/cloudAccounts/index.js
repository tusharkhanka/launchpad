const express = require('express');
const ValidateRequestErrors = require('../../utils/validateRequestMiddlewares');
const RequestWrapper = require('../../utils/requestWrapper');
const responseWrapper = require('../../utils/responseWrapper');
const validations = require('./cloudAccounts.validation');

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
  validations.updateCloudAccount(),
  ValidateRequestErrors(),
  RequestWrapper(notImpl)
);

router.delete(
  '/:id',
  validations.byId(),
  ValidateRequestErrors(),
  RequestWrapper(notImpl)
);

module.exports = router;

