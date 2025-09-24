const { seedDevToken, apiClient } = require('./helpers');

const BASE = 'http://localhost:9000';

describe('Organisations API', () => {
  let token;
  let api;
  let orgId;

  beforeAll(() => {
    token = seedDevToken();
    api = apiClient(BASE, token);
  });

  test('POST /api/v1/organisations -> 201 Created', async () => {
    const res = await api.post('/api/v1/organisations').send({ name: 'Test Org' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('data.id');
    expect(res.body.data.name).toBe('Test Org');
    orgId = res.body.data.id;
  });

  test('GET /api/v1/organisations/:id -> 200 OK', async () => {
    const res = await api.get(`/api/v1/organisations/${orgId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(orgId);
  });

  test('PUT /api/v1/organisations/:id -> 200 OK', async () => {
    const res = await api.put(`/api/v1/organisations/${orgId}`).send({ name: 'Updated Org' });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Updated Org');
  });

  test('GET /api/v1/organisations/:id (invalid uuid) -> 400 Bad Request', async () => {
    const res = await api.get('/api/v1/organisations/not-a-uuid');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  test('DELETE /api/v1/organisations/:id -> 204 No Content', async () => {
    const res = await api.delete(`/api/v1/organisations/${orgId}`);
    expect(res.status).toBe(204);
  });

  test('GET deleted organisation -> 404 Not Found', async () => {
    const res = await api.get(`/api/v1/organisations/${orgId}`);
    expect(res.status).toBe(404);
  });
});

