const express = require('express');
const ValidateRequestErrors = require('../../utils/validateRequestMiddlewares');
const RequestWrapper = require('../../utils/requestWrapper');
const { param, body } = require('express-validator');
const responseWrapper = require('../../utils/responseWrapper');

const router = express.Router();

const notImpl = (req, res) => responseWrapper.errorResponse(res, 501, 'Not implemented', {});

router.post(
  '/:orgId/environments',
  [param('orgId').isUUID(), body('name').isString().isLength({min:1, max:255}), body('region').isString().isLength({min:1, max:100}), body('vpcId').optional().isString().isLength({max:255}), body('cloudAccountId').isUUID(), body('metadata').optional().isObject()],
  ValidateRequestErrors(),
  RequestWrapper(notImpl)
);

router.get(
  '/:orgId/environments',
  [param('orgId').isUUID()],
  ValidateRequestErrors(),
  RequestWrapper(notImpl)
);

module.exports = router;

