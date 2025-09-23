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