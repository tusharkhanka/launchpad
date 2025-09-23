import { LOGIN_URL, SIGN_UP_URL, SSO_URL, httpClient } from "../config/api";

export const login = async (data) => {
  return httpClient.post({ url: LOGIN_URL, data });
};

export const signup = async (data) => {
  return httpClient.post({ url: SIGN_UP_URL, data });
};

export const sso = async (data) => {
  return httpClient.post({ url: SSO_URL, data });
};
