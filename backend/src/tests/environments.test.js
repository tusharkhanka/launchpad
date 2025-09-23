const { seedDevToken, apiClient } = require('./helpers');

const BASE = 'http://localhost:9000';

describe('Environments API', () => {
  let token;
  let api;
  let orgId;
  let caId;
  let envId;

  beforeAll(async () => {
    token = seedDevToken();
    api = apiClient(BASE, token);
    // Create org
    const orgRes = await api.post('/api/v1/organisations').send({ name: 'Org for Envs' });
    orgId = orgRes.body.data.id;
    // Create cloud account
    const caRes = await api
      .post(`/api/v1/organisations/${orgId}/cloud-accounts`)
      .send({
        provider: 'aws',
        accountIdentifier: '111111111111',
        accessRole: 'arn:aws:iam::111111111111:role/LaunchpadAccessRole',
        metadata: { env: 'stg' },
      });
    caId = caRes.body.data.id;
  });

  afterAll(async () => {
    if (envId) await api.delete(`/api/v1/environments/${envId}`);
    if (caId) await api.delete(`/api/v1/cloud-accounts/${caId}`);
    if (orgId) await api.delete(`/api/v1/organisations/${orgId}`);
  });

  test('POST /organisations/:orgId/environments -> 201', async () => {
    const res = await api
      .post(`/api/v1/organisations/${orgId}/environments`)
      .send({ name: 'staging', region: 'us-east-1', vpcId: 'vpc-abc', cloudAccountId: caId, metadata: { tier: 'stg' } });
    expect(res.status).toBe(201);
    envId = res.body.data.id;
  });

  test('GET /organisations/:orgId/environments -> 200', async () => {
    const res = await api.get(`/api/v1/organisations/${orgId}/environments`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.some((x) => x.id === envId)).toBe(true);
  });

  test('GET /environments/:id -> 200', async () => {
    const res = await api.get(`/api/v1/environments/${envId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(envId);
  });

  test('PUT /environments/:id -> 200', async () => {
    const res = await api.put(`/api/v1/environments/${envId}`).send({ name: 'staging-2' });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('staging-2');
  });

  test('Lifecycle stubs -> 501', async () => {
    const p1 = await api.post(`/api/v1/environments/${envId}/provision`);
    const p2 = await api.post(`/api/v1/environments/${envId}/destroy`);
    const p3 = await api.get(`/api/v1/environments/${envId}/status`);
    expect([p1.status, p2.status, p3.status]).toEqual([501, 501, 501]);
  });

  test('POST environment with invalid cloudAccountId -> 500 (FK error)', async () => {
    const res = await api
      .post(`/api/v1/organisations/${orgId}/environments`)
      .send({ name: 'bad', cloudAccountId: '11111111-1111-1111-1111-111111111111' });
    expect([400, 500]).toContain(res.status); // allow 400/500 depending on validation/DB
  });

  test('DELETE /environments/:id -> 204 then 404', async () => {
    const del = await api.delete(`/api/v1/environments/${envId}`);
    expect(del.status).toBe(204);
    const get = await api.get(`/api/v1/environments/${envId}`);
    expect(get.status).toBe(404);
    envId = undefined;
  });
});

