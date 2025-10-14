import { httpClient, CLOUD_ACCOUNTS_URL, CLOUD_ACCOUNT_BY_ID_URL, BASE_URL } from "../config/api";

export const createCloudAccount = async (orgId, data) => {
  return httpClient.post(
    { 
    url: CLOUD_ACCOUNTS_URL(orgId), 
    data: {
      provider: data.provider,
      account_name: data.account_name,
      account_identifier: data.account_identifier,
      access_keys: data.access_keys,
      metadata: data.metadata
    },
    token: true
  });
};

export const listCloudAccounts = async (orgId) => {
  return httpClient.get({ url: CLOUD_ACCOUNTS_URL(orgId), token: true });
};

export const getCloudAccount = async (id) => {
  return httpClient.get({ url: CLOUD_ACCOUNT_BY_ID_URL(id), token: true });
};

export const updateCloudAccount = async (id, data) => {
  return httpClient.put({ url: CLOUD_ACCOUNT_BY_ID_URL(id), data, token: true });
};

export const deleteCloudAccount = async (id) => {
  return httpClient.delete({ url: CLOUD_ACCOUNT_BY_ID_URL(id), token: true });
};

export const testCloudAccountConnection = async (data) => {
  return httpClient.post({
    url: `${BASE_URL}/cloud-accounts/test-connection`,
    data: {
      provider: data.provider,
      access_keys: data.access_keys
    },
    token: true
  });
};

export const listVpcs = async (cloudAccountId) => {
  return httpClient.get({ 
    url: `${BASE_URL}/cloud-accounts/${cloudAccountId}/vpcs`, 
    token: true 
  });
};


