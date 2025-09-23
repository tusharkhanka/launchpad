const { body, param } = require('express-validator');

module.exports = {
  createOrganisation: () => [
    body('name').isString().isLength({ min: 1, max: 255 })
  ],
  updateOrganisation: () => [
    param('id').isUUID(),
    body('name').optional().isString().isLength({ min: 1, max: 255 })
  ],
  byId: () => [
    param('id').isUUID()
  ],
  byOrgId: () => [
    param('orgId').isUUID()
  ]
};
