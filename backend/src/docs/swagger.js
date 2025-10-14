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
        provider: { type: "string", enum: ["aws", "gcp", "azure", "oracle"] },
        account_name: { type: "string" },
        account_identifier: { type: "string" },
        organisation_id: { type: "string", format: "uuid" },
        access_keys: { 
          type: "array",
          items: {
            type: "object",
            properties: {
              key: { type: "string" },
              value: { type: "string" }
            },
            required: ["key", "value"]
          }
        },
        metadata: { type: "object", additionalProperties: true, nullable: true },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
      required: ["id", "provider", "account_name", "account_identifier", "organisation_id", "access_keys"],
    },
    CreateCloudAccountRequest: {
      type: "object",
      properties: {
        provider: { type: "string", enum: ["aws", "gcp", "azure", "oracle"] },
        account_name: { type: "string" },
        account_identifier: { type: "string" },
        organisation_id: { type: "string", format: "uuid" },
        access_keys: { 
          type: "array",
          items: {
            type: "object",
            properties: {
              key: { type: "string" },
              value: { type: "string" }
            },
            required: ["key", "value"]
          }
        },
        metadata: { type: "object", additionalProperties: true },
      },
      required: ["provider", "account_name", "account_identifier", "organisation_id", "access_keys"],
      example: {
        provider: "aws",
        account_name: "Production AWS Account",
        account_identifier: "123456789012",
        organisation_id: "33809269-212a-4e4e-afbb-0a7ea17069ef",
        access_keys: [
          { key: "access_key_id", value: "AKIAIOSFODNN7EXAMPLE" },
          { key: "secret_access_key", value: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" }
        ],
        metadata: { region: "us-east-1", environment: "production" },
      },
    },
    UpdateCloudAccountRequest: {
      type: "object",
      properties: {
        provider: { type: "string", enum: ["aws", "gcp", "azure", "oracle"] },
        account_name: { type: "string" },
        account_identifier: { type: "string" },
        access_keys: { 
          type: "array",
          items: {
            type: "object",
            properties: {
              key: { type: "string" },
              value: { type: "string" }
            },
            required: ["key", "value"]
          }
        },
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
      responses: { 201: { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessEnvelope" } } } }, 400: responses.BadRequest, 401: responses.Unauthorized, 404: responses.NotFound },
    },
    get: {
      tags: ["Cloud Accounts"],
      security: [{ bearerAuth: [] }],
      summary: "List cloud accounts for organisation",
      parameters: [{ name: "orgId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
      responses: { 200: { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessEnvelope" } } } }, 401: responses.Unauthorized, 404: responses.NotFound },
    },
  },
  "/api/v1/cloud-accounts": {
    get: {
      tags: ["Cloud Accounts"],
      security: [{ bearerAuth: [] }],
      summary: "List all cloud accounts",
      responses: { 200: { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessEnvelope" } } } }, 401: responses.Unauthorized },
    },
    post: {
      tags: ["Cloud Accounts"],
      security: [{ bearerAuth: [] }],
      summary: "Create cloud account",
      requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateCloudAccountRequest" } } } },
      responses: { 201: { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessEnvelope" } } } }, 400: responses.BadRequest, 401: responses.Unauthorized },
    },
  },
  "/api/v1/cloud-accounts/{id}": {
    get: {
      tags: ["Cloud Accounts"],
      security: [{ bearerAuth: [] }],
      summary: "Get cloud account by id",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
      responses: { 200: { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessEnvelope" } } } }, 401: responses.Unauthorized, 404: responses.NotFound },
    },
    put: {
      tags: ["Cloud Accounts"],
      security: [{ bearerAuth: [] }],
      summary: "Update cloud account",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
      requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateCloudAccountRequest" } } } },
      responses: { 200: { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessEnvelope" } } } }, 400: responses.BadRequest, 401: responses.Unauthorized, 404: responses.NotFound },
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

const paths = { ...orgPaths, ...cloudAccountPaths };

module.exports = {
  openapi: "3.0.3",
  info: {
    title: "Launchpad Organization Service API",
    version: "1.0.0",
    description: "OpenAPI spec for Organisations and Cloud Accounts",
  },
  servers,
  tags: [
    { name: "Organisations" },
    { name: "Cloud Accounts" },
  ],
  components,
  paths,
};