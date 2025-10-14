import { getUserToken, clearLocalStorage } from "../config/helper";
import { history } from "../config/history";

let BASE_URL = "http://localhost:9000/api/v1";

if (process.env.REACT_APP_ENV === "staging") {
  BASE_URL = "https://stg.api.launchpad.probolabs.com/api/v1";
}

if (process.env.REACT_APP_ENV === "production") {
  BASE_URL = "https://api.launchpad.probolabs.com/api/v1";
}

export { BASE_URL };

// Auth URLs
export const LOGIN_URL = `${BASE_URL}/auth/login`;
export const SIGN_UP_URL = `${BASE_URL}/auth/signup`;
export const SSO_URL = `${BASE_URL}/auth/sso`;
export const LOGOUT_URL = `${BASE_URL}/auth/logout`;
export const VERIFY_TOKEN_URL = `${BASE_URL}/auth/verify`;

// Organizations URLs
export const ORGANIZATIONS_URL = `${BASE_URL}/organisations`;
export const ORGANIZATION_BY_ID_URL = (id) => `${BASE_URL}/organisations/${id}`;

// Cloud Accounts URLs
export const CLOUD_ACCOUNTS_URL = (orgId) => `${BASE_URL}/organisations/${orgId}/cloud-accounts`;
export const CLOUD_ACCOUNT_BY_ID_URL = (id) => `${BASE_URL}/cloud-accounts/${id}`;

// Environments URLs
export const ENVIRONMENTS_URL = (orgId) => `${BASE_URL}/organisations/${orgId}/environments`;
export const ENVIRONMENT_BY_ID_URL = (id) => `${BASE_URL}/environments/${id}`;
export const ENVIRONMENT_PROVISION_URL = (id) => `${BASE_URL}/environments/${id}/provision`;
export const ENVIRONMENT_DESTROY_URL = (id) => `${BASE_URL}/environments/${id}/destroy`;
export const ENVIRONMENT_STATUS_URL = (id) => `${BASE_URL}/environments/${id}/status`;

// Applications URLs
export const APPLICATIONS_URL = `${BASE_URL}/applications`;
export const APPLICATION_BY_ID_URL = (id) => `${BASE_URL}/applications/${id}`;
export const APPLICATION_SECRETS_URL = (appName, envName) => `${BASE_URL}/applications/${appName}/environments/${envName}/secrets`;
export const APPLICATION_TAGS_URL = (appName, envName) => `${BASE_URL}/applications/${appName}/environments/${envName}/tags`;

// Teams URLs
export const TEAMS_URL = `${BASE_URL}/teams`;
export const TEAM_BY_ID_URL = (id) => `${BASE_URL}/teams/${id}`;
export const TEAM_MEMBERS_URL = (teamId) => `${BASE_URL}/teams/${teamId}/members`;
export const TEAM_MEMBER_BY_ID_URL = (teamId, userId) => `${BASE_URL}/teams/${teamId}/members/${userId}`;

// Roles URLs
export const ROLES_URL = `${BASE_URL}/roles`;
export const ROLE_BY_ID_URL = (id) => `${BASE_URL}/roles/${id}`;

// Users URLs
export const USERS_URL = `${BASE_URL}/user`;
export const USER_SEARCH_URL = `${BASE_URL}/user/search`;
export const USER_TEAMS_AND_ROLES_URL = `${BASE_URL}/user/teams-and-roles`;

// Audit Logs URLs
export const AUDIT_LOGS_URL = `${BASE_URL}/auditlogs`;
export const AUDIT_LOGS_BY_USER_URL = (userId) => `${BASE_URL}/auditlogs/user/${userId}`;
export const AUDIT_LOGS_BY_ENTITY_URL = (entity) => `${BASE_URL}/auditlogs/entity/${entity}`;
export const AUDIT_LOGS_BY_ACTION_URL = (action) => `${BASE_URL}/auditlogs/action/${action}`;
export const AUDIT_LOGS_BY_STATUS_URL = (status) => `${BASE_URL}/auditlogs/status/${status}`;

/**
 * Default headers
 */
const requestHeaders = {
  "Content-type": "application/json",
};

/**
 * Generic response handler
 */
async function handleResponse({ requestOptions, method, url }) {
  try {
    const response = await fetch(url, requestOptions);

    let responseData = {
      data: {},
      isError: true,
      message: "Unknown error",
      statusCode: response.status,
    };

    if (response.status === 401) {
      // Unauthorized → clear local storage and redirect to login
      clearLocalStorage();
      setTimeout(() => {
        history.push("/login");
      }, 500);

      responseData = await response.json();
    } else if (response.ok) {
      responseData = await response.json();
    } else {
      responseData = await response.json();
    }

    return responseData;
  } catch (error) {
    console.error(`${method} request failed:`, error);
    return {
      data: {},
      isError: true,
      message:
        "Network error. Please check your connection and try again.",
      statusCode: 503,
    };
  }
}

/**
 * HTTP client with common methods
 */
export const httpClient = {
  get: async ({ url = "", token = false, headers = {} }) => {
    const method = "GET";
    const requestOptions = {
      method,
      headers: token
        ? {
            ...requestHeaders,
            Authorization: `Bearer ${getUserToken()}`,
            ...headers,
          }
        : { ...requestHeaders, ...headers },
    };

    return handleResponse({ requestOptions, method, url });
  },

  post: async ({ url = "", data = {}, token = false, headers = {} }) => {
    const method = "POST";
    const requestOptions = {
      method,
      body: JSON.stringify(data),
      headers: token
        ? {
            ...requestHeaders,
            Authorization: `Bearer ${getUserToken()}`,
            ...headers,
          }
        : { ...requestHeaders, ...headers },
    };

    return handleResponse({ requestOptions, method, url });
  },

  upload: async ({ url = "", data = {}, headers = {} }) => {
    const method = "POST";
    const requestOptions = {
      method,
      body: data,
      headers: {
        Authorization: `Bearer ${getUserToken()}`,
      },
    };

    return handleResponse({ requestOptions, method, url });
  },

  put: async ({ url = "", data = {}, token = false, headers = {} }) => {
    const method = "PUT";
    const requestOptions = {
      method,
      body: JSON.stringify(data),
      headers: token
        ? {
            ...requestHeaders,
            Authorization: `Bearer ${getUserToken()}`,
            ...headers,
          }
        : { ...requestHeaders, ...headers },
    };

    return handleResponse({ requestOptions, method, url });
  },

  patch: async ({ url = "", data = {}, token = false, headers = {} }) => {
    const method = "PATCH";
    const requestOptions = {
      method,
      body: JSON.stringify(data),
      headers: token
        ? {
            ...requestHeaders,
            Authorization: `Bearer ${getUserToken()}`,
            ...headers,
          }
        : { ...requestHeaders, ...headers },
    };

    return handleResponse({ requestOptions, method, url });
  },

  delete: async ({ url = "", data = {}, token = false, headers = {} }) => {
    const method = "DELETE";
    const requestOptions = {
      method,
      body: JSON.stringify(data),
      headers: token
        ? {
            ...requestHeaders,
            Authorization: `Bearer ${getUserToken()}`,
            ...headers,
          }
        : { ...requestHeaders, ...headers },
    };

    return handleResponse({ requestOptions, method, url });
  },
};