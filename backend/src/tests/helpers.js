const { execSync } = require('child_process');
const path = require('path');
const request = require('supertest');

function seedDevToken() {
  const scriptPath = path.resolve(__dirname, '../../scripts/seed-dev-session.js');
  let out;
  try {
    out = execSync(`node ${scriptPath}`, { encoding: 'utf8' });
  } catch (err) {
    throw new Error(`Failed to execute seed-dev-session script: ${err.message}`);
  }
  const firstLine = out.split('\n').find((l) => l.trim().startsWith('{')) || '{}';
  let parsed;
  try {
    parsed = JSON.parse(firstLine);
  } catch (err) {
    throw new Error(`Invalid JSON output from seed-dev-session script: ${firstLine}`);
  }
  if (!parsed.token) {
    throw new Error(`Missing token in seed-dev-session output: ${firstLine}`);
  }
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

