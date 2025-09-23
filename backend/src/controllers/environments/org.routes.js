const express = require('express');
const ValidateRequestErrors = require('../../utils/validateRequestMiddlewares');
const RequestWrapper = require('../../utils/requestWrapper');
const responseWrapper = require('../../utils/responseWrapper');
const validations = require('./environments.validation');

const router = express.Router();

const notImpl = (req, res) => responseWrapper.errorResponse(res, 501, 'Not implemented', {});

router.post(
  '/:orgId/environments',
  validations.createUnderOrg(),
  ValidateRequestErrors(),
  RequestWrapper(notImpl)
);

router.get(
  '/:orgId/environments',
  validations.listUnderOrg(),
  ValidateRequestErrors(),
  RequestWrapper(notImpl)
);

module.exports = router;

