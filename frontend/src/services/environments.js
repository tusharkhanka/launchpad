import { httpClient, ENVIRONMENTS_URL, ENVIRONMENT_BY_ID_URL, BASE_URL } from "../config/api";

export const createEnvironment = async (orgId, data) => {
  return httpClient.post({
    url: ENVIRONMENTS_URL(orgId),
    data: {
      name: data.name,
      cloud_account_id: data.cloud_account_id,
      org_id: orgId,
      vpc_id: data.vpc_id,
      metadata: data.metadata
    },
    token: true
  });
};

export const listEnvironments = async (orgId) => {
  return httpClient.get({ url: ENVIRONMENTS_URL(orgId), token: true });
};

export const listEnvironmentsByCloudAccount = async (cloudAccountId) => {
  return httpClient.get({ 
    url: `${BASE_URL}/environments/cloud-account/${cloudAccountId}`, 
    token: true 
  });
};

export const getEnvironment = async (id) => {
  return httpClient.get({ url: ENVIRONMENT_BY_ID_URL(id), token: true });
};

export const updateEnvironment = async (id, data) => {
  return httpClient.put({ url: ENVIRONMENT_BY_ID_URL(id), data, token: true });
};

export const deleteEnvironment = async (id) => {
  return httpClient.delete({ url: ENVIRONMENT_BY_ID_URL(id), token: true });
};
