const { seedDevToken, apiClient } = require('./helpers');

const BASE = 'http://localhost:9000';

describe('Cloud Accounts API', () => {
  let token;
  let api;
  let orgId;
  let caId;

  beforeAll(async () => {
    token = seedDevToken();
    api = apiClient(BASE, token);
    // Create an org to attach cloud accounts
    const orgRes = await api.post('/api/v1/organisations').send({ name: 'Org for CA' });
    orgId = orgRes.body.data.id;
  });

  afterAll(async () => {
    if (orgId) await api.delete(`/api/v1/organisations/${orgId}`);
  });

  test('POST /organisations/:orgId/cloud-accounts -> 201', async () => {
    const payload = {
      provider: 'aws',
      accountIdentifier: '999999999999',
      accessRole: 'arn:aws:iam::999999999999:role/LaunchpadAccessRole',
      metadata: { env: 'dev' },
    };
    const res = await api.post(`/api/v1/organisations/${orgId}/cloud-accounts`).send(payload);
    expect(res.status).toBe(201);
    caId = res.body.data.id;
  });

  test('GET /organisations/:orgId/cloud-accounts -> 200', async () => {
    const res = await api.get(`/api/v1/organisations/${orgId}/cloud-accounts`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.some((x) => x.id === caId)).toBe(true);
  });

  test('GET /cloud-accounts/:id -> 200', async () => {
    const res = await api.get(`/api/v1/cloud-accounts/${caId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(caId);
  });

  test('PUT /cloud-accounts/:id -> 200', async () => {
    const res = await api
      .put(`/api/v1/cloud-accounts/${caId}`)
      .send({ accessRole: 'arn:aws:iam::999999999999:role/NewRole' });
    expect(res.status).toBe(200);
    expect(res.body.data.access_role).toContain('NewRole');
  });

  test('GET /cloud-accounts/not-a-uuid -> 400', async () => {
    const res = await api.get('/api/v1/cloud-accounts/not-a-uuid');
    expect(res.status).toBe(400);
  });

  test('DELETE /cloud-accounts/:id -> 204', async () => {
    const res = await api.delete(`/api/v1/cloud-accounts/${caId}`);
    expect(res.status).toBe(204);
  });

  test('GET deleted cloud account -> 404', async () => {
    const res = await api.get(`/api/v1/cloud-accounts/${caId}`);
    expect(res.status).toBe(404);
  });
});

