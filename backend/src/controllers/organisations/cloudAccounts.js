const express = require('express');
const ValidateRequestErrors = require('../../utils/validateRequestMiddlewares');
const RequestWrapper = require('../../utils/requestWrapper');
const { param, body } = require('express-validator');
const responseWrapper = require('../../utils/responseWrapper');

const router = express.Router();

const notImpl = (req, res) => responseWrapper.errorResponse(res, 501, 'Not implemented', {});

router.post(
  '/:orgId/cloud-accounts',
  [param('orgId').isUUID(), body('provider').isIn(['aws','gcp','azure','oracle']), body('accountIdentifier').isString().isLength({min:1,max:255}), body('accessRole').isString().isLength({min:1,max:255}), body('metadata').optional().isObject()],
  ValidateRequestErrors(),
  RequestWrapper(notImpl)
);

router.get(
  '/:orgId/cloud-accounts',
  [param('orgId').isUUID()],
  ValidateRequestErrors(),
  RequestWrapper(notImpl)
);

module.exports = router;

