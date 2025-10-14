import { httpClient, USERS_URL, USER_SEARCH_URL, USER_TEAMS_AND_ROLES_URL } from "../config/api";

export const listUsers = async () => {
  return httpClient.get({ url: USERS_URL, token: true });
};

export const searchUsersByEmail = async (searchTerm) => {
  return httpClient.get({ 
    url: `${USER_SEARCH_URL}?searchTerm=${encodeURIComponent(searchTerm)}`, 
    token: true 
  });
};

export const getUserTeamsAndRoles = async () => {
  return httpClient.get({ url: USER_TEAMS_AND_ROLES_URL, token: true });
};
