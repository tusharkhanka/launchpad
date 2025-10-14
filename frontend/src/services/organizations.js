import { httpClient, ORGANIZATIONS_URL, ORGANIZATION_BY_ID_URL } from "../config/api";

export const createOrganization = async (data) => {
  return httpClient.post({ 
    url: ORGANIZATIONS_URL, 
    data: {
      name: data.name
    },
    token: true
  });
};

export const getOrganization = async (id) => {
  return httpClient.get({ url: ORGANIZATION_BY_ID_URL(id), token: true });
};

export const updateOrganization = async (id, data) => {
  return httpClient.put({ url: ORGANIZATION_BY_ID_URL(id), data, token: true });
};

export const deleteOrganization = async (id) => {
  return httpClient.delete({ url: ORGANIZATION_BY_ID_URL(id), token: true });
};

export const listOrganizations = async () => {
  return httpClient.get({ url: ORGANIZATIONS_URL, token: true });
};
