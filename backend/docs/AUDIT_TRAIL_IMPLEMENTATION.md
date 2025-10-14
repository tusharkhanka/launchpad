# Audit Trail Implementation

## Overview
This document describes the complete audit trail implementation for tracking all user actions in the system.

## Architecture

### Database Model
- **Table Name**: `audit_trail`
- **Model Location**: `src/db/models/auditTrail.js`
- **Migration**: `migrations/20251009000001-create_audit_trail_table.js`

#### Schema
```javascript
{
  id: UUID (Primary Key),
  action: STRING(255) - The action performed (CREATE, UPDATE, DELETE, etc.),
  user_id: INTEGER (nullable) - Foreign key to Test (User) table with CASCADE delete,
                                 NULL for unauthenticated operations (e.g., login/SSO attempts),
  entity: STRING(255) - The entity affected (APPLICATION, ENVIRONMENT, etc.),
  value: LONGTEXT - JSON stringified data of the operation,
  status: STRING(255) - SUCCESS or FAILURE,
  created_at: TIMESTAMP - Auto-generated timestamp
}
```

### Components Created

#### 1. Data Provider
**File**: `src/dataProviders/auditTrailProvider.js`

Methods:
- `create(data)` - Create new audit trail entry
- `findAll(limit, offset)` - Get all audit trails with pagination
- `findByUserId(userId, limit, offset)` - Filter by user
- `findByEntity(entity, limit, offset)` - Filter by entity
- `findByAction(action, limit, offset)` - Filter by action
- `findByStatus(status, limit, offset)` - Filter by status
- `findUnauthenticated(limit, offset)` - Get audit trails for unauthenticated operations (user_id is null)

#### 2. Service Layer
**File**: `src/services/auditTrail/auditTrail.service.js`

Methods:
- `create({ action, entity, value, userId, status })` - Create audit trail
- `getPaginated(limit, offset)` - Get paginated audit trails
- `getByUserId(userId, limit, offset)` - Get by user
- `getByEntity(entity, limit, offset)` - Get by entity
- `getByAction(action, limit, offset)` - Get by action
- `getByStatus(status, limit, offset)` - Get by status

#### 3. Controller
**File**: `src/controllers/auditTrail/auditTrail.controller.js`

Endpoints:
- `POST /api/v1/auditlogs` - Manually create audit trail
- `GET /api/v1/auditlogs` - Get all audit trails (Super Admin only)
- `GET /api/v1/auditlogs/user/:userId` - Get by user (Super Admin only)
- `GET /api/v1/auditlogs/entity/:entity` - Get by entity (Super Admin only)
- `GET /api/v1/auditlogs/action/:action` - Get by action (Super Admin only)
- `GET /api/v1/auditlogs/status/:status` - Get by status (Super Admin only)

#### 4. Routes
**File**: `src/controllers/auditTrail/index.js`
- Configured with validation middleware
- All routes require authentication
- Read operations require super admin privileges

#### 5. Validations
**File**: `src/controllers/auditTrail/auditTrail.validation.js`
- Input validation for all endpoints
- Pagination validation (limit: 1-1000, offset: 0+)

### Middleware Implementation

#### Audit Trail Middleware
**File**: `src/utils/auditTrailMiddleware.js`

Uses `cls-hooked` (continuation-local-storage) to maintain request context throughout the request lifecycle:
- Captures request data (body, params, query)
- Parses entity and action from URL
- Stores in namespace for access in response wrapper

#### Parse Entity and Action
**File**: `src/utils/parseEntityAndAction.js`

Intelligently parses the URL to determine:
- Main entity from path
- Sub-entities (e.g., APPLICATION > SECRET)
- HTTP method to action mapping

### Response Wrapper Integration
**File**: `src/utils/responseWrapper.js`

Automatically creates audit trails on:
- **Success responses** - Status: SUCCESS
- **Error responses** - Status: FAILURE (includes error message)

Special handling:
- Hides sensitive tokens for SSO operations
- Combines body and params data
- Catches audit creation errors to prevent breaking main flow

### Constants
**File**: `src/constants.js`

Added three new constant maps:
- `AUDIT_ENTITY_MAP` - Maps URL paths to entity names
- `AUDIT_ACTION_MAP` - Maps HTTP methods to actions (POST→CREATE, PUT/PATCH→UPDATE, DELETE→DELETE)
- `AUDIT_SUB_ENTITIES` - Maps sub-paths to sub-entity names

**Note**: Only POST, PUT, PATCH, and DELETE methods are logged. GET requests are intentionally excluded.

## Installation

### 1. Install Required Dependencies
```bash
cd backend
npm install cls-hooked
```

### 2. Run Migration
```bash
npm run migration:up
```

This will create the `audit_trail` table in your database.

## Usage

### Automatic Audit Trail (Default Behavior)
Audit trails are automatically created for **POST, PUT, PATCH, and DELETE** requests that use `responseWrapper.successResponse()` or `responseWrapper.errorResponse()`.

**Note**: GET requests are intentionally skipped to avoid logging read operations.

Example flow:
1. User makes request: `POST /api/v1/organisations`
2. Audit middleware captures request data
3. Controller processes request
4. Response wrapper automatically creates audit trail:
   - action: "CREATE"
   - entity: "ORGANISATION"
   - value: JSON of request body
   - status: "SUCCESS" or "FAILURE"
   - user_id: Current authenticated user

GET requests (read operations) are **not logged** to reduce audit trail volume and focus on data modifications.

**Authentication Operations**: 
- **Successful login/SSO**: Tracked with the actual `user_id` of the user who logged in
- **Failed login/SSO**: Tracked with `user_id: null` for security monitoring (brute force detection, etc.)
- The auth controllers automatically set `req.user` after successful authentication, ensuring the audit trail captures the actual user

### Manual Audit Trail Creation
For custom audit trails, use the service directly:

```javascript
const AuditTrailService = require('../services/auditTrail/auditTrail.service');

await AuditTrailService.create({
  action: 'DELETE',
  entity: 'APPLICATION > SECRET',
  value: JSON.stringify({ secretId: '123', name: 'API_KEY' }),
  userId: req.user.id,
  status: 'SUCCESS'
});
```

### Querying Audit Trails
All query endpoints require Super Admin privileges.

#### Get All Audit Trails
```bash
GET /api/v1/auditlogs?limit=50&offset=0
Authorization: Bearer <token>
```

Response:
```json
{
  "data": {
    "auditTrailData": [
      {
        "id": "uuid",
        "action": "CREATE",
        "entity": "ORGANISATION",
        "value": "{\"name\":\"Acme Corp\"}",
        "status": "SUCCESS",
        "created_at": "2025-10-09T12:00:00.000Z",
        "user": {
          "id": 1,
          "username": "admin",
          "email": "admin@example.com"
        }
      }
    ],
    "totalCount": 150,
    "limit": 50,
    "offset": 0
  },
  "message": "Success",
  "statusCode": 200
}
```

#### Get Audit Trails by User
```bash
GET /api/v1/auditlogs/user/1?limit=20&offset=0
Authorization: Bearer <token>
```

#### Get Audit Trails by Entity
```bash
GET /api/v1/auditlogs/entity/ORGANISATION?limit=20&offset=0
Authorization: Bearer <token>
```

#### Get Audit Trails by Action
```bash
GET /api/v1/auditlogs/action/CREATE?limit=20&offset=0
Authorization: Bearer <token>
```

#### Get Audit Trails by Status
```bash
GET /api/v1/auditlogs/status/SUCCESS?limit=20&offset=0
Authorization: Bearer <token>
```

## Configuration

### Adding New Entities
Edit `src/constants.js`:

```javascript
AUDIT_ENTITY_MAP: {
  // ... existing entries
  'my-new-resource': 'MY NEW RESOURCE',
}
```

### Adding New Sub-Entities
Edit `src/constants.js`:

```javascript
AUDIT_SUB_ENTITIES: {
  // ... existing entries
  'my-sub-resource': 'MY SUB RESOURCE',
}
```

### Adding New Actions
Edit `src/constants.js`:

```javascript
AUDIT_ACTION_MAP: {
  // ... existing entries
  CUSTOM: 'CUSTOM ACTION',
}
```

**Note**: GET requests are automatically filtered out and will not create audit trails regardless of the mapping.

## Security Considerations

1. **Super Admin Only**: All read operations require super admin privileges
2. **Sensitive Data**: Tokens and passwords are automatically hidden
3. **User Association**: Audit trails are tied to users when available. For auth operations:
   - Successful login/SSO → user_id is set (the user who logged in)
   - Failed login/SSO → user_id is null (for security monitoring)
4. **Cascade Delete**: When a user is deleted, their audit trails are preserved but the relation is cascaded
5. **Immutable**: No update or delete endpoints - audit trails should be append-only
6. **Read Operations Not Logged**: GET requests are not logged to reduce audit trail volume and focus on data modifications
7. **Authentication Tracking**: 
   - Successful logins are tracked with the actual user who logged in
   - Failed login attempts are tracked without user_id for security monitoring

## Performance Considerations

1. **Indexing**: The table has indexes on `created_at` and `user_id` for faster queries
2. **Pagination**: All list operations support pagination (max 1000 per page)
3. **Async Creation**: Audit trail creation errors don't break the main request flow
4. **Ordering**: Results are ordered by `created_at DESC` (newest first)
5. **Reduced Volume**: GET requests are not logged, significantly reducing audit trail volume

## Testing

### Test Audit Trail Creation

#### Test Authenticated Operation
```bash
# Make any authenticated request
POST /api/v1/organisations
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Test Organisation"
}

# Check if audit trail was created
GET /api/v1/auditlogs?limit=1
Authorization: Bearer <super-admin-token>
```

#### Test Authentication Operation (Login/SSO)
```bash
# Make a successful SSO login request (no auth header needed)
POST /api/v1/auth/sso
Content-Type: application/json

{
  "token": "valid-google-sso-token"
}

# Check if audit trail was created
GET /api/v1/auditlogs?limit=1
Authorization: Bearer <super-admin-token>

# Response for SUCCESSFUL SSO will show:
{
  "id": "uuid",
  "action": "CREATE",
  "entity": "AUTH > SSO",
  "value": "{\"token\":\"Hidden\"}",
  "status": "SUCCESS",
  "created_at": "2025-10-09T12:00:00.000Z",
  "user": {
    "id": 123,
    "username": "pransu",
    "email": "pransu54321@gmail.com"
  }  // User IS captured because controller sets req.user after successful auth
}

# Response for FAILED SSO will show:
{
  "id": "uuid",
  "action": "CREATE",
  "entity": "AUTH > SSO",
  "value": "{\"token\":\"Hidden\"}",
  "status": "FAILURE",
  "created_at": "2025-10-09T12:00:00.000Z",
  "user": null  // null for failed attempts (security monitoring)
}
```

## Troubleshooting

### Audit Trails Not Being Created
1. Check if `auditTrailMiddleware` is registered in `src/middleware/index.js`
2. Check if `cls-hooked` is installed
3. Verify the request method is POST, PUT, PATCH, or DELETE (GET requests are not logged)
4. Check console for audit creation errors
5. Ensure `responseWrapper.successResponse()` or `errorResponse()` is being used in the controller

### Cannot Access Audit Logs
1. Verify user has `isSuperAdmin` flag set to true
2. Check authentication token is valid

### Entity/Action Not Recognized
1. Add missing entity to `AUDIT_ENTITY_MAP` in constants
2. Add missing sub-entity to `AUDIT_SUB_ENTITIES` in constants
3. Restart server after updating constants

## Future Enhancements

Potential improvements:
1. Add date range filtering
2. Add full-text search on value field
3. Add audit trail retention policies
4. Add audit trail export functionality
5. Add audit trail analytics dashboard
6. Add webhook notifications for critical actions

