const { body, param } = require('express-validator');

module.exports = {
  createOrganisation: () => [
    body('name').trim().notEmpty().isString().isLength({ min: 1, max: 255 })
  ],
  updateOrganisation: () => [
    param('id').isUUID(),
    body('name').optional().trim().notEmpty().isString().isLength({ min: 1, max: 255 })
  ],
  byId: () => [
    param('id').isUUID()
  ]
};
