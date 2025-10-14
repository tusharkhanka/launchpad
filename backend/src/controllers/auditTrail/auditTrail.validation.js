const { body, param, query } = require('express-validator');

module.exports = {
  createAuditTrail: () => [
    body('action').trim().notEmpty().isString(),
    body('entity').trim().notEmpty().isString(),
    body('auditData').notEmpty(),
    body('status').optional().isString().isIn(['SUCCESS', 'FAILURE']),
  ],
  
  getPaginated: () => [
    query('limit').optional().isInt({ min: 1, max: 1000 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
  ],

  getByUserId: () => [
    param('userId').isInt().toInt(),
    query('limit').optional().isInt({ min: 1, max: 1000 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
  ],

  getByEntity: () => [
    param('entity').trim().notEmpty().isString(),
    query('limit').optional().isInt({ min: 1, max: 1000 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
  ],

  getByAction: () => [
    param('action').trim().notEmpty().isString(),
    query('limit').optional().isInt({ min: 1, max: 1000 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
  ],

  getByStatus: () => [
    param('status').trim().notEmpty().isString().isIn(['SUCCESS', 'FAILURE']),
    query('limit').optional().isInt({ min: 1, max: 1000 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
  ],
};

