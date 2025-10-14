const { Constants } = require('../constants');

const parseEntityAndAction = (method, originalUrl) => {
  try {
    // Skip GET requests - we don't want to log read operations
    if (method === 'GET') {
      return null;
    }

    // Extract path without query params
    const path = originalUrl.split('?')[0];
    
    // Remove /api/v1 prefix
    const cleanPath = path.replace(/^\/api\/v\d+\//, '');
    
    // Split path into segments
    const segments = cleanPath.split('/').filter(segment => segment);
    
    if (segments.length === 0) {
      return null;
    }

    // Get the main entity (first segment)
    const mainEntity = segments[0];
    
    // Map HTTP method to action
    const action = Constants.AUDIT_ACTION_MAP[method] || method;
    
    // Get entity name from map
    let entity = Constants.AUDIT_ENTITY_MAP[mainEntity] || mainEntity.toUpperCase();
    
    // Check for sub-entities (second segment if it's not a UUID/ID)
    if (segments.length > 1) {
      const secondSegment = segments[1];
      
      // If second segment is not an ID (UUID or numeric), it might be a sub-entity
      const isId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(secondSegment) || 
                   /^\d+$/.test(secondSegment);
      
      if (!isId && Constants.AUDIT_SUB_ENTITIES[secondSegment]) {
        entity = `${entity} > ${Constants.AUDIT_SUB_ENTITIES[secondSegment]}`;
      } else if (segments.length > 2 && Constants.AUDIT_SUB_ENTITIES[segments[2]]) {
        // Check third segment for sub-entity (e.g., /applications/:id/secrets)
        entity = `${entity} > ${Constants.AUDIT_SUB_ENTITIES[segments[2]]}`;
      }
    }

    return {
      action,
      entity,
    };
  } catch (error) {
    console.error('Error parsing entity and action:', error);
    return null;
  }
};

module.exports = { parseEntityAndAction };

