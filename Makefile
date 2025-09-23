.PHONY: up down restart ps logs verify verify-proxy migrate build rebuild

# Bring the full stack up (MySQL, backend, frontend, reverse proxy)
up:
	docker compose up -d

# Bring the stack up using production overrides (no direct backend/frontend ports)
up-prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d


# Stop all services and remove containers (keeps volumes)
down:
	docker compose down

# Restart services
restart: down up

# Show status
ps:
	docker compose ps

# Tail logs for all services
logs:
	docker compose logs -f --tail=100

# Build images explicitly (compose will build on demand)
build:
	docker compose build

# Force rebuild without cache
rebuild:
	docker compose build --no-cache

# Run DB migrations using the backend container (npx will download sequelize-cli on the fly)
migrate:
	docker compose run --rm backend npx sequelize db:migrate

# Quick verification (direct service ports)
verify:
	docker compose ps && \
	curl -s -i http://localhost:9000/health | head -n 10 && echo && \
	curl -s -i http://localhost:3000/ | head -n 10

# Verify via reverse proxy on localhost (HTTP)
verify-proxy:
	curl -s -i http://localhost/health | head -n 10 && echo && \
	curl -s -i http://localhost/ | head -n 10

