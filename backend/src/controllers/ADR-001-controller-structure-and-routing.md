# ADR-001: Controller Structure and Routing Patterns for Organization Service v1

- Status: Accepted
- Date: 2025-09-24

## Context

We considered two alternatives for organizing controllers and designing routes for the Organization Service v1:

1) Flat-by-domain controller structure (current)
- Each domain (organisations, cloudAccounts, environments) lives at `controllers/{domain}/`.
- Each domain exposes:
  - A top-level router (`index.js`) for single-resource (by-id) operations
  - An organisation-scoped router (`org.routes.js`) for collection/create under an organisation
- Route mounting order is defined centrally in `src/utils/router.js`.

2) Nested-under-organisations controller structure (proposed)
- Move `cloudAccounts/` and `environments/` folders under `controllers/organisations/` to mirror the DB relationship (org → cloud accounts → environments).

We also evaluated routing styles for org-scoped resources:
- Hybrid routing (current):
  - Collections and creation nested under organisations, e.g., `POST/GET /organisations/:orgId/cloud-accounts`
  - Single-resource operations by globally unique id at top-level, e.g., `GET/PUT/DELETE /cloud-accounts/:id`
- Fully nested everywhere (alternative):
  - Enforce `/:orgId/` in all routes, e.g., `GET/PUT/DELETE /organisations/:orgId/cloud-accounts/:id`

Relevant code review feedback (bito-code-review) flagged:
- Route mounting order conflict in `src/utils/router.js` (shadowing nested routes) → we reordered mounts.
- Missing/unclear API route responsibilities between org-scoped vs top-level → clarified and made consistent.

## Decision

- Keep the flat-by-domain controller structure.
- Continue with the hybrid routing pattern:
  - Org-scoped collections and creation are nested under organisations
  - Single-resource operations are addressed by global IDs at top-level
- Enforce tenancy/authorization on all single-resource operations via service-layer checks against `organisation_id`.

This mirrors common REST conventions, supports clear ownership boundaries, and keeps the codebase maintainable and discoverable.

## Consequences

Benefits
- Maintainability: A shallow, predictable folder layout per domain improves discoverability and reduces coupling.
- Developer experience: Short import paths and simple IDE navigation; developers go to `controllers/{domain}` for everything about that resource.
- REST alignment: Nested paths for collections (scoped actions), top-level for by-id operations; a widely used pattern.
- Scalability: New org-scoped resources can follow the same template without concentrating everything inside `organisations/`.

Trade-offs
- Requires explicit route mounting order to avoid path shadowing (fixed and documented below).
- Tenancy checks must be consistently implemented in services for top-level by-id endpoints.
- Two URL "contexts" (nested collections vs top-level by-id) require clear documentation and Swagger examples.

## Implementation

### File organization pattern

For each org-scoped domain (e.g., cloud accounts, environments):
- `controllers/{domain}/{domain}.controller.js`
- `controllers/{domain}/{domain}.validation.js`
- `controllers/{domain}/index.js` → top-level by-id routes (GET/PUT/DELETE /{resource}/:id)
- `controllers/{domain}/org.routes.js` → org-scoped collection routes (POST/GET /organisations/:orgId/{resource})

Example: cloud accounts
```
controllers/
  cloudAccounts/
    cloudAccounts.controller.js
    cloudAccounts.validation.js
    index.js       # GET/PUT/DELETE /cloud-accounts/:id
    org.routes.js  # POST/GET /organisations/:orgId/cloud-accounts
```
Example: environments
```
controllers/
  environments/
    environments.controller.js
    environments.validation.js
    index.js       # GET/PUT/DELETE /environments/:id
    org.routes.js  # POST/GET /organisations/:orgId/environments
```

### Route mounting order (critical)

Mount nested organisation-scoped routes BEFORE the generic organisations CRUD router to avoid shadowing, then mount top-level resource routers:

```js
// src/utils/router.js
app.use(`${apiPrefix}/organisations`, require('../controllers/cloudAccounts/org.routes'))
app.use(`${apiPrefix}/organisations`, require('../controllers/environments/org.routes'))
app.use(`${apiPrefix}/organisations`, require('../controllers/organisations'))
// Top-level resource routers
app.use(`${apiPrefix}/cloud-accounts`, require('../controllers/cloudAccounts'))
app.use(`${apiPrefix}/environments`, require('../controllers/environments'))
```

This ordering resolves the conflict identified by code review.

### API endpoint patterns

Org-scoped collections (create/list under an organisation):
- Cloud Accounts: `POST /api/v1/organisations/:orgId/cloud-accounts`
- Cloud Accounts: `GET  /api/v1/organisations/:orgId/cloud-accounts`
- Environments:  `POST /api/v1/organisations/:orgId/environments`
- Environments:  `GET  /api/v1/organisations/:orgId/environments`

Top-level single-resource operations (by global id):
- Cloud Accounts: `GET    /api/v1/cloud-accounts/:id`
- Cloud Accounts: `PUT    /api/v1/cloud-accounts/:id`
- Cloud Accounts: `DELETE /api/v1/cloud-accounts/:id`
- Environments:  `GET    /api/v1/environments/:id`
- Environments:  `PUT    /api/v1/environments/:id`
- Environments:  `DELETE /api/v1/environments/:id`

Concrete examples (current implementation)

Cloud Accounts org-scoped routes (`controllers/cloudAccounts/org.routes.js`):
```js
router.post(
  '/:orgId/cloud-accounts',
  validations.createUnderOrg(),
  ValidateRequestErrors(),
  RequestWrapper(Controller.createUnderOrg)
);
router.get(
  '/:orgId/cloud-accounts',
  validations.listUnderOrg(),
  ValidateRequestErrors(),
  RequestWrapper(Controller.listUnderOrg)
);
```

Cloud Accounts by-id routes (`controllers/cloudAccounts/index.js`):
```js
router.get('/:id', validations.byId(), ValidateRequestErrors(), RequestWrapper(Controller.getById));
router.put('/:id', validations.updateCloudAccount(), ValidateRequestErrors(), RequestWrapper(Controller.update));
router.delete('/:id', validations.byId(), ValidateRequestErrors(), RequestWrapper(Controller.remove));
```

Environments org-scoped routes (`controllers/environments/org.routes.js`) follow the same pattern for `/environments` under an organisation. The `controllers/environments/index.js` exposes the by-id routes.

### Tenancy enforcement strategy

- All by-id operations must enforce that the resource belongs to an organisation the caller is authorized to access.
- Implementation guidance:
  - Service layer fetches by id, then validates `resource.organisation_id` against the caller’s permitted orgs (derived from auth context or access control logic).
  - If the resource does not exist or is outside the caller’s tenancy scope, return `null` and surface `404 Not Found` (to avoid information leakage).
  - Keep validation and tenancy checks close to services/data providers for consistent enforcement across controllers.

Example (conceptual):
```js
const item = await provider.findById(id);
if (!item || !callerCanAccessOrg(item.organisation_id, authContext)) return null;
return item;
```

### Applying this pattern to future org-scoped resources

For new domains (e.g., projects, billing):
1. Create `controllers/{domain}/` with `{domain}.controller.js`, `{domain}.validation.js`.
2. Add `controllers/{domain}/index.js` for by-id routes and `controllers/{domain}/org.routes.js` for org-scoped collection routes.
3. Mount routes in `src/utils/router.js` in the documented order (org-scoped first, then generic org CRUD, then top-level by-id routers).
4. Implement service-layer tenancy checks on all by-id operations.
5. Update Swagger/OpenAPI docs to include both nested collection and top-level by-id endpoints, with examples.
6. Add tests for both patterns: org-scoped list/create and by-id get/update/delete.

## References

- bito-code-review findings:
  - Route mounting order conflict (resolved by mounting org-scoped routes before organisations CRUD)
  - Clarification on org-scoped vs top-level routes for cloud accounts and environments
- Current implementations:
  - `src/controllers/cloudAccounts/{index.js, org.routes.js}`
  - `src/controllers/environments/{index.js, org.routes.js}`
  - `src/utils/router.js` (mount order)
- REST patterns inspiration: Nested collections for scoping; top-level by-id for canonical resource addressing, with authorization checks.

