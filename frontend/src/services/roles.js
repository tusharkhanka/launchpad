import { httpClient, ROLES_URL, ROLE_BY_ID_URL } from "../config/api";

export const createRole = async (data) => {
  return httpClient.post({ 
    url: ROLES_URL, 
    data: {
      name: data.name
    },
    token: true
  });
};

export const getRole = async (id) => {
  return httpClient.get({ url: ROLE_BY_ID_URL(id), token: true });
};

export const updateRole = async (id, data) => {
  return httpClient.put({ url: ROLE_BY_ID_URL(id), data, token: true });
};

export const deleteRole = async (id) => {
  return httpClient.delete({ url: ROLE_BY_ID_URL(id), token: true });
};

export const listRoles = async () => {
  return httpClient.get({ url: ROLES_URL, token: true });
};

