// OpenAPI 3.0 specification for Launchpad Organization Service v1

const servers = [
  { url: "http://localhost:9000", description: "Local" },
];

const components = {
  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
  schemas: {
    SuccessEnvelope: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: { type: "string", example: "OK" },
        data: { type: "object" },
      },
      required: ["statusCode", "data"],
    },
    ErrorResponse: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 400 },
        message: { type: "string", example: "Validation error" },
        error: { type: "string", example: "Bad Request" },
        data: { type: "object", nullable: true },
      },
      required: ["statusCode", "message"],
    },
    Organisation: {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid" },
        name: { type: "string" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
      required: ["id", "name"],
    },
    CreateOrganisationRequest: {
      type: "object",
      properties: { name: { type: "string" } },
      required: ["name"],
      example: { name: "Acme Corp" },
    },
    CloudAccount: {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid" },
        organisation_id: { type: "string", format: "uuid" },
        provider: { type: "string", enum: ["aws", "gcp", "azure", "oracle"] },
        account_identifier: { type: "string" },
        access_role: { type: "string" },
        metadata: { type: "object", additionalProperties: true },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
      required: ["id", "organisation_id", "provider", "account_identifier"],
    },
    CreateCloudAccountRequest: {
      type: "object",
      properties: {
        provider: { type: "string", enum: ["aws", "gcp", "azure", "oracle"] },
        accountIdentifier: { type: "string" },
        accessRole: { type: "string" },
        metadata: { type: "object", additionalProperties: true },
      },
      required: ["provider", "accountIdentifier", "accessRole"],
      example: {
        provider: "aws",
        accountIdentifier: "123456789012",
        accessRole: "arn:aws:iam::123456789012:role/LaunchpadAccessRole",
        metadata: { env: "dev" },
      },
    },
    UpdateCloudAccountRequest: {
      type: "object",
      properties: {
        accessRole: { type: "string" },
        metadata: { type: "object", additionalProperties: true },
      },
      example: { accessRole: "arn:aws:iam::123456789012:role/NewRole" },
    },
    Environment: {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid" },
        organisation_id: { type: "string", format: "uuid" },
        cloud_account_id: { type: "string", format: "uuid" },
        name: { type: "string" },
        vpc_id: { type: "string", nullable: true },
        region: { type: "string", nullable: true },
        state: { type: "string", enum: ["CREATING", "ACTIVE", "UPDATING", "FAILED", "DELETING"] },
        metadata: { type: "object", additionalProperties: true },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
      required: ["id", "organisation_id", "cloud_account_id", "name"],
    },
    CreateEnvironmentRequest: {
      type: "object",
      properties: {
        name: { type: "string" },
        region: { type: "string" },
        vpcId: { type: "string", pattern: "^vpc-[0-9a-f]{8,17}$" },
        cloudAccountId: { type: "string", format: "uuid" },
        metadata: { type: "object", additionalProperties: true },
      },
      required: ["name", "cloudAccountId"],
      example: {
        name: "staging",
        region: "us-east-1",
        vpcId: "vpc-1234abcd",
        cloudAccountId: "33809269-212a-4e4e-afbb-0a7ea17069ef",
        metadata: { tier: "stg" },
      },
    },
    UpdateEnvironmentRequest: {
      type: "object",
      properties: {
        name: { type: "string" },
        region: { type: "string" },
        vpcId: { type: "string", pattern: "^vpc-[0-9a-f]{8,17}$" },
        metadata: { type: "object", additionalProperties: true },
      },
    },
  },
};

const responses = {
  NotFound: { description: "Resource not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
  BadRequest: { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
  Unauthorized: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
  NoContent: { description: "No Content" },
};

const orgPaths = {
  "/api/v1/organisations": {
    post: {
      tags: ["Organisations"],
      security: [{ bearerAuth: [] }],
      summary: "Create an organisation",
      requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateOrganisationRequest" } } } },
      responses: {
        201: { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessEnvelope" } } } },
        400: responses.BadRequest,
        401: responses.Unauthorized,
      },
    },
  },
  "/api/v1/organisations/{id}": {
    get: {
      tags: ["Organisations"],
      security: [{ bearerAuth: [] }],
      summary: "Get organisation by id",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
      responses: { 200: { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessEnvelope" } } } }, 401: responses.Unauthorized, 404: responses.NotFound },
    },
    put: {
      tags: ["Organisations"],
      security: [{ bearerAuth: [] }],
      summary: "Update organisation",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
      requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateOrganisationRequest" } } } },
      responses: { 200: { description: "OK" }, 400: responses.BadRequest, 401: responses.Unauthorized, 404: responses.NotFound },
    },
    delete: {
      tags: ["Organisations"],
      security: [{ bearerAuth: [] }],
      summary: "Delete organisation",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
      responses: { 204: responses.NoContent, 401: responses.Unauthorized, 404: responses.NotFound },
    },
  },
};

const cloudAccountPaths = {
  "/api/v1/organisations/{orgId}/cloud-accounts": {
    post: {
      tags: ["Cloud Accounts"],
      security: [{ bearerAuth: [] }],
      summary: "Create cloud account under organisation",
      parameters: [{ name: "orgId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
      requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateCloudAccountRequest" } } } },
      responses: { 201: { description: "Created" }, 400: responses.BadRequest, 401: responses.Unauthorized, 404: responses.NotFound },
    },
    get: {
      tags: ["Cloud Accounts"],
      security: [{ bearerAuth: [] }],
      summary: "List cloud accounts for organisation",
      parameters: [{ name: "orgId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
      responses: { 200: { description: "OK" }, 401: responses.Unauthorized, 404: responses.NotFound },
    },
  },
  "/api/v1/cloud-accounts/{id}": {
    get: {
      tags: ["Cloud Accounts"],
      security: [{ bearerAuth: [] }],
      summary: "Get cloud account by id",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
      responses: { 200: { description: "OK" }, 401: responses.Unauthorized, 404: responses.NotFound },
    },
    put: {
      tags: ["Cloud Accounts"],
      security: [{ bearerAuth: [] }],
      summary: "Update cloud account",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
      requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateCloudAccountRequest" } } } },
      responses: { 200: { description: "OK" }, 400: responses.BadRequest, 401: responses.Unauthorized, 404: responses.NotFound },
    },
    delete: {
      tags: ["Cloud Accounts"],
      security: [{ bearerAuth: [] }],
      summary: "Delete cloud account",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
      responses: { 204: responses.NoContent, 401: responses.Unauthorized, 404: responses.NotFound },
    },
  },
};

const environmentPaths = {
  "/api/v1/organisations/{orgId}/environments": {
    post: {
      tags: ["Environments"],
      security: [{ bearerAuth: [] }],
      summary: "Create environment under organisation",
      parameters: [{ name: "orgId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
      requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateEnvironmentRequest" } } } },
      responses: { 201: { description: "Created" }, 400: responses.BadRequest, 401: responses.Unauthorized, 404: responses.NotFound },
    },
    get: {
      tags: ["Environments"],
      security: [{ bearerAuth: [] }],
      summary: "List environments for organisation",
      parameters: [{ name: "orgId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
      responses: { 200: { description: "OK" }, 401: responses.Unauthorized, 404: responses.NotFound },
    },
  },
  "/api/v1/environments/{id}": {
    get: {
      tags: ["Environments"],
      security: [{ bearerAuth: [] }],
      summary: "Get environment by id",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
      responses: { 200: { description: "OK" }, 401: responses.Unauthorized, 404: responses.NotFound },
    },
    put: {
      tags: ["Environments"],
      security: [{ bearerAuth: [] }],
      summary: "Update environment",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
      requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateEnvironmentRequest" } } } },
      responses: { 200: { description: "OK" }, 400: responses.BadRequest, 401: responses.Unauthorized, 404: responses.NotFound },
    },
    delete: {
      tags: ["Environments"],
      security: [{ bearerAuth: [] }],
      summary: "Delete environment",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
      responses: { 204: responses.NoContent, 401: responses.Unauthorized, 404: responses.NotFound },
    },
  },
  "/api/v1/environments/{id}/provision": {
    post: {
      tags: ["Environments"],
      security: [{ bearerAuth: [] }],
      summary: "Provision environment (stub)",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
      responses: { 501: { description: "Not Implemented" }, 401: responses.Unauthorized, 404: responses.NotFound },
    },
  },
  "/api/v1/environments/{id}/destroy": {
    post: {
      tags: ["Environments"],
      security: [{ bearerAuth: [] }],
      summary: "Destroy environment (stub)",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
      responses: { 501: { description: "Not Implemented" }, 401: responses.Unauthorized, 404: responses.NotFound },
    },
  },
  "/api/v1/environments/{id}/status": {
    get: {
      tags: ["Environments"],
      security: [{ bearerAuth: [] }],
      summary: "Get environment status (stub)",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
      responses: { 501: { description: "Not Implemented" }, 401: responses.Unauthorized, 404: responses.NotFound },
    },
  },
};

const paths = { ...orgPaths, ...cloudAccountPaths, ...environmentPaths };

module.exports = {
  openapi: "3.0.3",
  info: {
    title: "Launchpad Organization Service API",
    version: "1.0.0",
    description: "OpenAPI spec for Organisations, Cloud Accounts, and Environments",
  },
  servers,
  tags: [
    { name: "Organisations" },
    { name: "Cloud Accounts" },
    { name: "Environments" },
  ],
  components,
  paths,
};

