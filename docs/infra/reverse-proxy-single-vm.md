# Single-VM Reverse Proxy + TLS (Optional)

This document describes how to run a single reverse proxy in front of the Launchpad stack to:
- Serve the React frontend on your domain over HTTPS
- Proxy API traffic to the backend service
- Optionally issue and renew TLS certificates automatically (Let's Encrypt)

We use Caddy as the reverse proxy due to its simple configuration and automatic HTTPS support.

---

## Files added in this change

- docker-compose.yml: adds the `reverse-proxy` service (Caddy on ports 80, 443)
- infra/caddy/Caddyfile: default HTTP-only reverse proxy (for local/dev)
- infra/caddy/Caddyfile.tls: production-ready TLS reverse proxy (for public domain)

---

## Quick start (local/dev, HTTP only)

1) Ensure the stack is running:

```
docker compose up -d mysql backend frontend reverse-proxy
```

2) Access via the proxy:
- Frontend: http://localhost/
- API: http://localhost/api/v1/... (e.g., http://localhost/health or http://localhost/api/v1/user)

Notes:
- The default Caddyfile uses only HTTP on port 80 and proxies:
  - /api/* and /health -> backend:9000
  - all other routes -> frontend:80

---

## Production (TLS with Let's Encrypt)

Prerequisites:
- A DNS A/AAAA record for your app domain (e.g., app.example.com) pointing to your VM's public IP
- Ports 80 and 443 open to the Internet (firewall/security group)

Steps:
1) Set environment variables for the proxy (email required by ACME providers like Let's Encrypt):

```
export CADDY_DOMAIN=app.example.com
export CADDY_EMAIL=you@example.com
```

2) Switch the mounted Caddyfile to the TLS version (if not already):
- In docker-compose.yml, the reverse-proxy service mounts `./infra/caddy/Caddyfile` by default.
- To enable TLS, either replace that file with the contents of `Caddyfile.tls` or update the mount to `Caddyfile.tls`.

Example (one-time swap):
```
cp infra/caddy/Caddyfile.tls infra/caddy/Caddyfile
```

3) Start the proxy (or restart if running):
```
docker compose up -d reverse-proxy
```

4) Verify:
```
curl -I http://$CADDY_DOMAIN
# Expect 308 redirect to https://$CADDY_DOMAIN/

curl -I https://$CADDY_DOMAIN
# Expect 200 OK from the frontend via Caddy
```

---

## Troubleshooting

- Certificate issuance fails:
  - Ensure the domain resolves to your VM public IP and ports 80/443 are reachable
  - Check logs: `docker compose logs reverse-proxy --tail 100`

- Backend not reachable through proxy:
  - Confirm backend is Up: `docker compose ps`
  - Test directly: `curl -i http://localhost:9000/health`
  - Caddy routes /api/* and /health to backend:9000

- Frontend not reachable:
  - Confirm frontend is Up and serving on port 80 inside the container: `docker compose ps`

---

## Notes
- The default compose still exposes backend (9000) and frontend (3000) for convenience. In production, you may remove these external port mappings and expose only the reverse proxy (80, 443).
- For local TLS without a public domain, you can add `tls internal` inside the site block of `Caddyfile.tls` and trust Caddy's local CA on your machine. Use `curl -k` or a trusted CA for testing.

