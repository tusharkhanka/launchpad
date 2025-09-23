const { execSync } = require('child_process');
const request = require('supertest');

function seedDevToken() {
  const out = execSync('node scripts/seed-dev-session.js', { cwd: process.cwd(), encoding: 'utf8' });
  // The script prints a JSON line first
  const firstLine = out.split('\n').find((l) => l.trim().startsWith('{')) || '{}';
  const parsed = JSON.parse(firstLine);
  return parsed.token;
}

function apiClient(baseUrl, token) {
  const client = request(baseUrl);
  const auth = (req) => (token ? req.set('Authorization', `Bearer ${token}`) : req);
  return {
    get: (url) => auth(client.get(url)),
    post: (url) => auth(client.post(url)).set('Content-Type', 'application/json'),
    put: (url) => auth(client.put(url)).set('Content-Type', 'application/json'),
    delete: (url) => auth(client.delete(url)),
  };
}

module.exports = { seedDevToken, apiClient };

