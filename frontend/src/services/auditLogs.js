import { httpClient, BASE_URL } from "../config/api";

// Audit Logs URLs
export const AUDIT_LOGS_URL = `${BASE_URL}/auditlogs`;
export const AUDIT_LOGS_BY_USER_URL = (userId) => `${BASE_URL}/auditlogs/user/${userId}`;
export const AUDIT_LOGS_BY_ENTITY_URL = (entity) => `${BASE_URL}/auditlogs/entity/${entity}`;
export const AUDIT_LOGS_BY_ACTION_URL = (action) => `${BASE_URL}/auditlogs/action/${action}`;
export const AUDIT_LOGS_BY_STATUS_URL = (status) => `${BASE_URL}/auditlogs/status/${status}`;

/**
 * Get paginated audit logs
 * @param {number} limit - Number of records per page
 * @param {number} offset - Offset for pagination
 */
export const getAuditLogs = async (limit = 50, offset = 0) => {
  return httpClient.get({ 
    url: `${AUDIT_LOGS_URL}?limit=${limit}&offset=${offset}`, 
    token: true 
  });
};

/**
 * Get audit logs by user ID
 * @param {number} userId - User ID
 * @param {number} limit - Number of records per page
 * @param {number} offset - Offset for pagination
 */
export const getAuditLogsByUser = async (userId, limit = 50, offset = 0) => {
  return httpClient.get({ 
    url: `${AUDIT_LOGS_BY_USER_URL(userId)}?limit=${limit}&offset=${offset}`, 
    token: true 
  });
};

/**
 * Get audit logs by entity
 * @param {string} entity - Entity name (e.g., 'ORGANISATION', 'APPLICATION')
 * @param {number} limit - Number of records per page
 * @param {number} offset - Offset for pagination
 */
export const getAuditLogsByEntity = async (entity, limit = 50, offset = 0) => {
  return httpClient.get({ 
    url: `${AUDIT_LOGS_BY_ENTITY_URL(entity)}?limit=${limit}&offset=${offset}`, 
    token: true 
  });
};

/**
 * Get audit logs by action
 * @param {string} action - Action name (e.g., 'CREATE', 'UPDATE', 'DELETE')
 * @param {number} limit - Number of records per page
 * @param {number} offset - Offset for pagination
 */
export const getAuditLogsByAction = async (action, limit = 50, offset = 0) => {
  return httpClient.get({ 
    url: `${AUDIT_LOGS_BY_ACTION_URL(action)}?limit=${limit}&offset=${offset}`, 
    token: true 
  });
};

/**
 * Get audit logs by status
 * @param {string} status - Status ('SUCCESS' or 'FAILURE')
 * @param {number} limit - Number of records per page
 * @param {number} offset - Offset for pagination
 */
export const getAuditLogsByStatus = async (status, limit = 50, offset = 0) => {
  return httpClient.get({ 
    url: `${AUDIT_LOGS_BY_STATUS_URL(status)}?limit=${limit}&offset=${offset}`, 
    token: true 
  });
};

/**
 * Create manual audit log (for special cases)
 * @param {object} data - { action, entity, auditData, status }
 */
export const createAuditLog = async (data) => {
  return httpClient.post({ 
    url: AUDIT_LOGS_URL, 
    data, 
    token: true 
  });
};

