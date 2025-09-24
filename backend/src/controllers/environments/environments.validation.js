const { body, param } = require('express-validator');

module.exports = {
  byId: () => [
    param('id').isUUID(),
  ],
  updateEnvironment: () => [
    param('id').isUUID(),
    body('name').optional().isString().isLength({ min: 1, max: 255 }),
    body('region').optional().isString().isLength({ min: 1, max: 100 }),
    body('vpcId').optional().isString().isLength({ max: 255 }).matches(/^vpc-[0-9a-f]{8,17}$/),
    body('metadata').optional().isObject(),
  ],
  createUnderOrg: () => [
    param('orgId').isUUID(),
    body('name').isString().isLength({ min: 1, max: 255 }),
    body('region').isString().isLength({ min: 1, max: 100 }),
    body('vpcId').optional().isString().isLength({ max: 255 }).matches(/^vpc-[0-9a-f]{8,17}$/),
    body('cloudAccountId').isUUID(),
    body('metadata').optional().isObject(),
  ],
  listUnderOrg: () => [
    param('orgId').isUUID(),
  ],
};
