const AuditTrail = require('../db/models/auditTrail');
const Test = require('../db/models/test');

const AuditTrailDataProvider = {
  create: async (data) => AuditTrail.create(data),
  
  findById: async (id) => AuditTrail.findByPk(id, { 
    include: [{
      model: Test,
      as: 'user',
      attributes: ['id', 'username', 'email'],
      required: false  // LEFT JOIN - user can be null for unauthenticated operations
    }],
    raw: false 
  }),
  
  findAll: async (limit = 50, offset = 0) => {
    return AuditTrail.findAndCountAll({
      include: [{
        model: Test,
        as: 'user',
        attributes: ['id', 'username', 'email'],
        required: false  // LEFT JOIN - user can be null for unauthenticated operations
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      raw: false
    });
  },
  
  findByUserId: async (userId, limit = 50, offset = 0) => {
    return AuditTrail.findAndCountAll({
      where: { user_id: userId },
      include: [{
        model: Test,
        as: 'user',
        attributes: ['id', 'username', 'email'],
        required: false  // LEFT JOIN
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      raw: false
    });
  },

  findByEntity: async (entity, limit = 50, offset = 0) => {
    return AuditTrail.findAndCountAll({
      where: { entity },
      include: [{
        model: Test,
        as: 'user',
        attributes: ['id', 'username', 'email'],
        required: false  // LEFT JOIN - user can be null for unauthenticated operations
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      raw: false
    });
  },

  findByAction: async (action, limit = 50, offset = 0) => {
    return AuditTrail.findAndCountAll({
      where: { action },
      include: [{
        model: Test,
        as: 'user',
        attributes: ['id', 'username', 'email'],
        required: false  // LEFT JOIN - user can be null for unauthenticated operations
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      raw: false
    });
  },

  findByStatus: async (status, limit = 50, offset = 0) => {
    return AuditTrail.findAndCountAll({
      where: { status },
      include: [{
        model: Test,
        as: 'user',
        attributes: ['id', 'username', 'email'],
        required: false  // LEFT JOIN - user can be null for unauthenticated operations
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      raw: false
    });
  },

  findUnauthenticated: async (limit = 50, offset = 0) => {
    return AuditTrail.findAndCountAll({
      where: { user_id: null },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      raw: false
    });
  },
};

module.exports = AuditTrailDataProvider;

