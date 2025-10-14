const auditTrailProvider = require('../../dataProviders/auditTrailProvider');

const AuditTrailService = {
  create: async ({ action, entity, value, userId, status = 'SUCCESS' }) => {
    try {
      // Allow audit trails for both authenticated and unauthenticated requests
      // userId will be null for unauthenticated operations (e.g., login/SSO attempts)
      const auditData = {
        action,
        entity,
        value,
        user_id: userId || null,
        status,
      };

      const created = await auditTrailProvider.create(auditData);
      return created ? created.get({ plain: true }) : null;
    } catch (error) {
      // Log error but don't throw - audit trail creation should not break the main flow
      console.error('Error creating audit trail:', error);
      return null;
    }
  },

  getPaginated: async (limit = 50, offset = 0) => {
    const { rows, count } = await auditTrailProvider.findAll(limit, offset);
    
    const auditTrailData = rows.map(row => {
      const data = row.get({ plain: true });
      return {
        id: data.id,
        action: data.action,
        entity: data.entity,
        value: data.value,
        status: data.status,
        created_at: data.created_at,
        user: data.user ? {
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
        } : null,
      };
    });

    return {
      auditTrailData,
      totalCount: count,
      limit: parseInt(limit),
      offset: parseInt(offset),
    };
  },

  getByUserId: async (userId, limit = 50, offset = 0) => {
    const { rows, count } = await auditTrailProvider.findByUserId(userId, limit, offset);
    
    const auditTrailData = rows.map(row => {
      const data = row.get({ plain: true });
      return {
        id: data.id,
        action: data.action,
        entity: data.entity,
        value: data.value,
        status: data.status,
        created_at: data.created_at,
        user: data.user ? {
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
        } : null,
      };
    });

    return {
      auditTrailData,
      totalCount: count,
      limit: parseInt(limit),
      offset: parseInt(offset),
    };
  },

  getByEntity: async (entity, limit = 50, offset = 0) => {
    const { rows, count } = await auditTrailProvider.findByEntity(entity, limit, offset);
    
    const auditTrailData = rows.map(row => {
      const data = row.get({ plain: true });
      return {
        id: data.id,
        action: data.action,
        entity: data.entity,
        value: data.value,
        status: data.status,
        created_at: data.created_at,
        user: data.user ? {
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
        } : null,
      };
    });

    return {
      auditTrailData,
      totalCount: count,
      limit: parseInt(limit),
      offset: parseInt(offset),
    };
  },

  getByAction: async (action, limit = 50, offset = 0) => {
    const { rows, count } = await auditTrailProvider.findByAction(action, limit, offset);
    
    const auditTrailData = rows.map(row => {
      const data = row.get({ plain: true });
      return {
        id: data.id,
        action: data.action,
        entity: data.entity,
        value: data.value,
        status: data.status,
        created_at: data.created_at,
        user: data.user ? {
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
        } : null,
      };
    });

    return {
      auditTrailData,
      totalCount: count,
      limit: parseInt(limit),
      offset: parseInt(offset),
    };
  },

  getByStatus: async (status, limit = 50, offset = 0) => {
    const { rows, count } = await auditTrailProvider.findByStatus(status, limit, offset);
    
    const auditTrailData = rows.map(row => {
      const data = row.get({ plain: true });
      return {
        id: data.id,
        action: data.action,
        entity: data.entity,
        value: data.value,
        status: data.status,
        created_at: data.created_at,
        user: data.user ? {
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
        } : null,
      };
    });

    return {
      auditTrailData,
      totalCount: count,
      limit: parseInt(limit),
      offset: parseInt(offset),
    };
  },
};

module.exports = AuditTrailService;

