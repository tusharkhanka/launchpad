# Package: Self-Hosted Solution

This guide packages the Launchpad stack (MySQL, Backend API, Frontend UI, Reverse Proxy) for self-hosting using Docker Compose. It also includes convenience commands and environment configuration.

## What’s included
- docker-compose.yml (services: mysql, backend, frontend, reverse-proxy)
- .env.example (copy to .env and customize)
- Makefile with common commands (up, down, migrate, verify)
- Optional reverse proxy (Caddy) for single-VM HTTP/HTTPS

## Prerequisites
- Docker and Docker Compose
- Ports 80, 443, 9000, 3000 free on the host (depending on what you expose)

## Quick start
1) Copy and edit environment
```
cp .env.example .env
# edit .env as needed (DB credentials, JWT secret, domain/email)
```

2) Start the stack
```
make up
make ps
```

3) Run database migrations (first-time setup)
```
make migrate
```
This uses `docker compose run --rm backend npx sequelize db:migrate` to apply migrations against the MySQL service.

4) Verify (direct ports)
```
make verify
```
- Backend health: http://localhost:9000/health
- Frontend: http://localhost:3000/

5) Optional: Reverse proxy verification (if enabled)
```
make verify-proxy
```
- Health: http://localhost/health
- App: http://localhost/

## Configuration
- Edit `.env` to override defaults (Compose auto-loads it).
- DB credentials: MYSQL_* vars control the MySQL service; DB_* vars configure backend connections.
- JWT_SECRET & GOOGLE_CLIENT_ID configure authentication.
- REACT_APP_ENV sets the frontend mode (E.g., development).
- CADDY_DOMAIN/CADDY_EMAIL configure the reverse proxy.

## Common operations
- Start: `make up`
- Stop: `make down`
- Logs: `make logs`
- Status: `make ps`
- Rebuild images: `make rebuild`
- Migrate DB: `make migrate`

## Notes
- The backend migration step uses `npx` inside the backend container, which downloads `sequelize-cli` on demand. Ensure internet connectivity.
- For production, consider terminating TLS via the reverse proxy and removing direct port exposures for backend and frontend. See `docs/infra/reverse-proxy-single-vm.md`.
- For Kubernetes-based deployments, see `docs/infra/helm-deploy.md`.

