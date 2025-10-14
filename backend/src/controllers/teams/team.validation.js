const { body, param } = require('express-validator');

module.exports = {
  createTeam: () => [
    body('name').trim().notEmpty().isString().isLength({ min: 1, max: 255 }),
    body('email').trim().notEmpty().isEmail().isLength({ min: 1, max: 255 })
  ],
  updateTeam: () => [
    param('id').isUUID(),
    body('name').optional().trim().notEmpty().isString().isLength({ min: 1, max: 255 }),
    body('email').optional().trim().notEmpty().isEmail().isLength({ min: 1, max: 255 })
  ],
  byId: () => [
    param('id').isUUID()
  ]
};

