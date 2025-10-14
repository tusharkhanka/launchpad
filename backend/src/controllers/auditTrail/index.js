const express = require('express');
const AuditTrailController = require('./auditTrail.controller');
const ValidateRequestErrors = require('../../utils/validateRequestMiddlewares');
const RequestWrapper = require('../../utils/requestWrapper');
const validations = require('./auditTrail.validation');

const router = express.Router();

// POST /api/v1/auditlogs - Create audit trail (manual)
router.post(
  '/',
  validations.createAuditTrail(),
  ValidateRequestErrors(),
  RequestWrapper(AuditTrailController.create)
);

// GET /api/v1/auditlogs - Get all audit trails (paginated)
router.get(
  '/',
  validations.getPaginated(),
  ValidateRequestErrors(),
  RequestWrapper(AuditTrailController.getPaginated)
);

// GET /api/v1/auditlogs/user/:userId - Get audit trails by user ID
router.get(
  '/user/:userId',
  validations.getByUserId(),
  ValidateRequestErrors(),
  RequestWrapper(AuditTrailController.getByUserId)
);

// GET /api/v1/auditlogs/entity/:entity - Get audit trails by entity
router.get(
  '/entity/:entity',
  validations.getByEntity(),
  ValidateRequestErrors(),
  RequestWrapper(AuditTrailController.getByEntity)
);

// GET /api/v1/auditlogs/action/:action - Get audit trails by action
router.get(
  '/action/:action',
  validations.getByAction(),
  ValidateRequestErrors(),
  RequestWrapper(AuditTrailController.getByAction)
);

// GET /api/v1/auditlogs/status/:status - Get audit trails by status
router.get(
  '/status/:status',
  validations.getByStatus(),
  ValidateRequestErrors(),
  RequestWrapper(AuditTrailController.getByStatus)
);

module.exports = router;

