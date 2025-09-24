const { body, param } = require('express-validator');

module.exports = {
  byId: () => [
    param('id').isUUID()
  ],
  updateCloudAccount: () => [
    param('id').isUUID(),
    body('accessRole').optional().trim().notEmpty().isString().isLength({ min: 1, max: 255 }),
    body('metadata').optional().isObject(),
  ],
  createUnderOrg: () => [
    param('orgId').isUUID(),
    body('provider').isIn(['aws','gcp','azure','oracle']),
    body('accountIdentifier').trim().notEmpty().isString().isLength({ min: 1, max: 255 }),
    body('accessRole').trim().notEmpty().isString().isLength({ min: 1, max: 255 }),
    body('metadata').optional().isObject(),
  ],
  listUnderOrg: () => [
    param('orgId').isUUID(),
  ],
};
