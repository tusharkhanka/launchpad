import { jwtDecode } from "jwt-decode";

export const getUserFromToken = (token) => {
  try {
    return jwtDecode(token); // { id, email, exp, ... }
  } catch {
    return null;
  }
};

export const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};
