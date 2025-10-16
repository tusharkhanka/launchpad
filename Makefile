.PHONY: up down restart ps logs logs-stop logs-combined logs-backend logs-frontend logs-mysql logs-proxy clean verify verify-proxy migrate build rebuild

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

# Stop enhanced logging (started by install.sh)
logs-stop:
	@if [ -f logs/pids.txt ]; then \
		kill -TERM $$(cat logs/pids.txt) 2>/dev/null || true; \
		rm -f logs/pids.txt; \
		echo "Enhanced logging stopped."; \
	else \
		echo "No enhanced logging processes found."; \
	fi

# View combined logs from files (tail -f)
logs-combined:
	tail -f logs/combined.log

# View backend logs from files (tail -f)
logs-backend:
	tail -f logs/backend.log

# View frontend logs from files (tail -f)
logs-frontend:
	tail -f logs/frontend.log

# View MySQL logs from files (tail -f)
logs-mysql:
	tail -f logs/mysql.log

# View reverse proxy logs from files (tail -f)
logs-proxy:
	tail -f logs/reverse-proxy.log

# Complete cleanup: stop logging, containers, images, volumes, and networks
clean: logs-stop
	docker compose down --volumes --rmi all --remove-orphans
	@if [ -d logs ]; then rm -rf logs && echo "Logs directory cleaned."; fi
	@if [ -f .env ]; then rm -f .env && echo "Environment file removed."; fi
