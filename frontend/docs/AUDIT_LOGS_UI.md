# Audit Logs Frontend Implementation

## Overview
This document describes the frontend implementation of the Audit Logs feature.

## Files Created

### 1. Service Layer
**File**: `src/services/auditLogs.js`

API service functions:
- `getAuditLogs(limit, offset)` - Get paginated audit logs
- `getAuditLogsByUser(userId, limit, offset)` - Filter by user
- `getAuditLogsByEntity(entity, limit, offset)` - Filter by entity
- `getAuditLogsByAction(action, limit, offset)` - Filter by action
- `getAuditLogsByStatus(status, limit, offset)` - Filter by status
- `createAuditLog(data)` - Manually create audit log (for special cases)

### 2. View Component
**File**: `src/views/AuditLogs/index.js`

Main audit logs view with features:
- **Table View**: Displays all audit logs in a paginated table
- **Search**: Search across action, entity, user name, and email
- **Filters**: 
  - Entity filter (dropdown)
  - Action filter (dropdown)
  - Status filter (SUCCESS/FAILURE)
- **Pagination**: Configurable rows per page (10, 25, 50, 100)
- **Detail Dialog**: Click on any log to view full details
- **Auto-refresh**: Refresh button to reload data
- **Responsive Design**: Works on mobile, tablet, and desktop

### 3. Styles
**File**: `src/views/AuditLogs/style.module.scss`

Modular SCSS with:
- Responsive layout
- Professional table styling
- Filter bar styling
- Detail dialog styling
- Mobile-first approach

### 4. Navigation
**Updated Files**:
- `src/components/SideBar/index.js` - Added "Audit Logs" menu item with History icon
- `src/router/index.js` - Added `/audit-logs` route

### 5. API Configuration
**Updated File**: `src/config/api.js`
- Added audit log URL constants

## Features

### 📊 Table Columns
1. **Timestamp** - When the action occurred
2. **User** - Username and email (or "System / Unauthenticated")
3. **Entity** - What was affected (e.g., ORGANISATION, APPLICATION)
4. **Action** - What was done (CREATE, UPDATE, DELETE)
5. **Status** - SUCCESS or FAILURE (color-coded chips)
6. **Details** - View button to see full log data

### 🔍 Search & Filters
- **Global Search**: Searches across multiple fields simultaneously
- **Entity Filter**: Filter by specific entity types (220px width)
- **Action Filter**: Filter by action types (220px width)
- **Status Filter**: Show only SUCCESS or FAILURE logs (220px width)
- **Date/Time Filter**: 
  - Click the filter icon to show/hide date range filters
  - Start Date: Filter logs after a specific date and time
  - End Date: Filter logs before a specific date and time
  - Can use either or both dates
  - Automatically includes entire end date (23:59:59)
  - Smooth slide-down animation
- **Clear Filters**: One-click to reset all filters including dates

### 📄 Pagination
- Server-side pagination for performance
- Configurable rows per page
- Shows total count
- Page navigation

### 👁️ Detail View
Modal dialog showing:
- Full timestamp
- User information
- Entity and action
- Status chip
- Complete JSON data with syntax highlighting
- Pretty-printed JSON format

## Usage

### Access the Audit Logs
1. Navigate to the application
2. Click on "Audit Logs" in the sidebar (History icon)
3. View all audit trail entries

### Search for Specific Logs
```
1. Use the search bar to search for:
   - User names
   - User emails
   - Entity names
   - Actions
2. Results update in real-time
```

### Filter Logs
```
1. Use the dropdown filters for Entity, Action, or Status
2. Click the filter icon (🔽) to show date/time filters
3. Select start date/time and/or end date/time
4. Combine multiple filters together
5. Click "Clear All Filters" to reset everything
6. Click "Clear Dates" to only reset date filters
```

### View Log Details
```
1. Click the eye icon (👁️) on any row
2. View complete log information
3. See formatted JSON data
4. Close the dialog when done
```

### Navigate Pages
```
1. Use the pagination controls at the bottom
2. Change rows per page (10, 25, 50, 100)
3. Navigate between pages
```

## Permissions

⚠️ **Super Admin Only**: The audit logs page requires super admin privileges. If a non-admin user tries to access it, they will see an error message: "You dont have access to this module"

## API Integration

The frontend calls the backend API endpoints:
- `GET /api/v1/auditlogs?limit=50&offset=0`
- `GET /api/v1/auditlogs/user/:userId?limit=50&offset=0`
- `GET /api/v1/auditlogs/entity/:entity?limit=50&offset=0`
- `GET /api/v1/auditlogs/action/:action?limit=50&offset=0`
- `GET /api/v1/auditlogs/status/:status?limit=50&offset=0`

All requests include the authentication token.

## Component Structure

```
AuditLogs/
├── index.js          # Main component
└── style.module.scss # Styles

Services:
└── auditLogs.js      # API service functions
```

## State Management

The component manages:
- `auditLogs` - Array of audit log entries
- `totalCount` - Total number of logs (for pagination)
- `loading` - Loading state
- `error` - Error messages
- `searchTerm` - Search input
- `page` - Current page number
- `rowsPerPage` - Rows per page setting
- `filterEntity` - Entity filter (220px width)
- `filterAction` - Action filter (220px width)
- `filterStatus` - Status filter (220px width)
- `startDate` - Start date/time filter
- `endDate` - End date/time filter
- `showDateFilters` - Toggle date filter visibility
- `detailDialog` - Detail dialog state

## Responsive Design

### Desktop (1200px+)
- Full table with all columns
- Side-by-side filters
- Wide search bar

### Tablet (768px - 1200px)
- Condensed table
- Stacked filters
- Adjusted spacing

### Mobile (< 768px)
- Horizontal scroll for table
- Full-width filters
- Stacked header
- Touch-friendly buttons

## Features Implemented ✅

1. ✅ Date/Time Range Filtering
2. ✅ Collapsible filter section with animation
3. ✅ Wider filter dropdowns (220px)
4. ✅ Combined date and other filters
5. ✅ Clear individual date filters
6. ✅ Clear all filters at once

## Future Enhancements

Potential improvements:
1. Export audit logs to CSV/Excel
2. Advanced search with query builder
3. Real-time updates with WebSocket
4. Graphs and analytics
5. Custom columns selection
6. Bulk operations
7. Email notifications for critical events
8. Audit log retention policy UI
9. Compare changes between versions
10. Quick date presets (Today, Last 7 days, Last 30 days, etc.)

## Troubleshooting

### "You dont have access to this module"
- This means you're not a super admin
- Contact your administrator to grant super admin access

### No Audit Logs Showing
- Check if you have super admin privileges
- Verify the backend is running
- Check browser console for API errors
- Ensure you've made some API calls (logs are only created for POST, PUT, PATCH, DELETE)

### Slow Loading
- Reduce the rows per page
- Use filters to narrow down results
- Check backend performance

## Browser Support

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

Material-UI components used:
- Table, TableBody, TableCell, TableContainer, TableHead, TableRow
- Paper, Box, Typography
- TextField, Select, MenuItem, FormControl, InputLabel
- Button, IconButton, Chip, Tooltip
- Dialog, DialogTitle, DialogContent, DialogActions
- CircularProgress, Alert
- Icons: Search, Refresh, FilterList, Visibility, History

All dependencies are already included in the project.

