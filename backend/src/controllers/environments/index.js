const express = require('express');
const ValidateRequestErrors = require('../../utils/validateRequestMiddlewares');
const RequestWrapper = require('../../utils/requestWrapper');
const { param, body } = require('express-validator');
const responseWrapper = require('../../utils/responseWrapper');

const router = express.Router();

const notImpl = (req, res) => responseWrapper.errorResponse(res, 501, 'Not implemented', {});

router.get(
  '/:id',
  [param('id').isUUID()],
  ValidateRequestErrors(),
  RequestWrapper(notImpl)
);

router.put(
  '/:id',
  [param('id').isUUID(), body('name').optional().isString().isLength({min:1,max:255}), body('region').optional().isString().isLength({min:1,max:100}), body('vpcId').optional().isString().isLength({max:255}), body('metadata').optional().isObject()],
  ValidateRequestErrors(),
  RequestWrapper(notImpl)
);

router.delete(
  '/:id',
  [param('id').isUUID()],
  ValidateRequestErrors(),
  RequestWrapper(notImpl)
);

// Operational endpoints (provision/destroy/status)
router.post(
  '/:id/provision',
  [param('id').isUUID()],
  ValidateRequestErrors(),
  RequestWrapper(notImpl)
);

router.post(
  '/:id/destroy',
  [param('id').isUUID()],
  ValidateRequestErrors(),
  RequestWrapper(notImpl)
);

router.get(
  '/:id/status',
  [param('id').isUUID()],
  ValidateRequestErrors(),
  RequestWrapper(notImpl)
);

module.exports = router;

