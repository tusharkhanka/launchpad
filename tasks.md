# Launchpad Infrastructure Setup — Atomic Task Checklist

This checklist extracts the atomic tasks from infra-setup.md and organizes them for step-by-step execution. Each task includes a brief description, acceptance criteria, verification steps, time estimate, and references.

---

## Task 0 — Install prerequisites
- Description: Install and validate core tooling required for local development and deployment.
- Acceptance Criteria (AC):
  - node -v shows v18+ and npm -v shows 9+
  - Docker/Compose installed; docker compose version shows v2.20+
  - Optional: kubectl 1.25+ and Helm 3.8+ available
- Verification:
  ```sh
  node -v && npm -v
  docker run --rm hello-world
  docker compose version
  kubectl version --client  # optional
  helm version              # optional
  ```
- Estimated Time: 15–20 minutes
- References:
  - docs/hosting/README.md (macOS/local section)
  - https://nodejs.org/ | https://docs.docker.com/ | https://kubernetes.io/ | https://helm.sh/docs/

## Task 1 — Provision local MySQL with Docker
- Description: Start a local MySQL 8 instance with a database and user for Launchpad.
- Acceptance Criteria (AC):
  - MySQL container is running and healthy
  - Database "launchpad" exists and is accessible with the configured user
- Verification:
  ```sh
  docker run -d \
    --name mysql \
    -e MYSQL_ROOT_PASSWORD=root \
    -e MYSQL_DATABASE=launchpad \
    -e MYSQL_USER=launchpad \
    -e MYSQL_PASSWORD=launchpad \
    -p 3306:3306 \
    mysql:8.0

  docker ps
  docker exec -it mysql mysql -ulaunchpad -plaunchpad -e "SHOW DATABASES LIKE 'launchpad';"
  ```
- Estimated Time: 15–20 minutes
- References:
  - backend/src/db/dataSource.js
  - Docker Hub: https://hub.docker.com/_/mysql

## Task 2 — Create backend .env
- Description: Create backend/.env with all required environment variables for DB, JWT, and OAuth.
- Acceptance Criteria (AC):
  - backend/src/utils/environment.js loads values (dotenv)
  - sequelize config resolves to correct hosts/credentials
  - No missing env errors when starting backend
- Verification:
  ```sh
  cat > backend/.env <<'EOF'
  PORT=9000
  DB_MASTER_HOST=localhost
  DB_READER_HOST=localhost
  DB_PORT=3306
  DB_USERNAME=launchpad
  DB_PASSWORD=launchpad
  DB_NAME=launchpad
  DB_LOGGING=false
  JWT_SECRET=replace-with-strong-secret
  GOOGLE_CLIENT_ID=replace-with-google-client-id
  EOF

  node -e "require('dotenv').config({path:'backend/.env'}); console.log(!!process.env.JWT_SECRET)"
  ```
- Estimated Time: 15 minutes
- References:
  - backend/src/utils/environment.js
  - backend/src/db/dataSource.js
  - backend/config/config.js

## Task 3 — Install backend dependencies
- Description: Install Node dependencies for the backend service.
- Acceptance Criteria (AC):
  - backend/node_modules installed successfully
  - npm scripts available (start, dev, migration:up)
- Verification:
  ```sh
  cd backend
  npm install
  npm ls --depth=0
  ```
- Estimated Time: 15 minutes
- References:
  - backend/package.json

## Task 4 — Run DB migrations
- Description: Apply Sequelize migrations to create required tables and indices.
- Acceptance Criteria (AC):
  - Tables Test and user_sessions are created
  - Indices on user_sessions are present
- Verification:
  ```sh
  cd backend
  npm run migration:up
  docker exec -it mysql mysql -ulaunchpad -plaunchpad launchpad -e "SHOW TABLES;"
  docker exec -it mysql mysql -ulaunchpad -plaunchpad launchpad -e "SHOW INDEX FROM user_sessions;"
  ```
- Estimated Time: 15–20 minutes
- References:
  - backend/migrations/*
  - backend/config/config.js
  - sequelize-cli docs: https://sequelize.org/docs/v6/other-topics/migrations/

## Task 5 — Start backend API (dev)
- Description: Start the Express server and validate health.
- Acceptance Criteria (AC):
  - Console shows "Database connected successfully!" and server listening on PORT
  - GET /health returns expected message
- Verification:
  ```sh
  cd backend
  npm run dev  # or: npm start
  # In another terminal:
  curl -s http://localhost:9000/health
  ```
- Estimated Time: 15 minutes
- References:
  - backend/src/index.js
  - backend/src/utils/router.js

## Task 6 — Create frontend .env.local and install deps
- Description: Configure frontend environment and install dependencies.
- Acceptance Criteria (AC):
  - CRA dev server starts and serves UI on http://localhost:3000
  - API requests point to http://localhost:9000/api/v1 (development)
- Verification:
  ```sh
  cd frontend
  printf "REACT_APP_ENV=development\n" > .env.local
  npm install
  npm start
  # Check browser dev tools Network tab: requests go to http://localhost:9000/api/v1
  ```
- Estimated Time: 20–30 minutes
- References:
  - frontend/src/config/api.js
  - CRA env docs: https://create-react-app.dev/docs/adding-custom-environment-variables/

## Task 7 — Validate auth flows (local)
- Description: Smoke-test signup/login and a protected route end-to-end.
- Acceptance Criteria (AC):
  - /api/v1/auth/signup and /login return 200 and a token/user
  - /api/v1/user requires Authorization: Bearer <token> and returns data
  - user_sessions record is created after login
- Verification:
  ```sh
  # Signup (example)
  curl -s -X POST http://localhost:9000/api/v1/auth/signup \
    -H 'Content-Type: application/json' \
    -d '{"username":"dev1","email":"dev1@example.com","password":"P@ssw0rd"}' | jq .

  # Login
  TOKEN=$(curl -s -X POST http://localhost:9000/api/v1/auth/login \
    -H 'Content-Type: application/json' \
    -d '{"email":"dev1@example.com","password":"P@ssw0rd"}' | jq -r .data.token)

  # Protected route
  curl -s http://localhost:9000/api/v1/user -H "Authorization: Bearer $TOKEN" | jq .
  ```
- Estimated Time: 20–30 minutes
- References:
  - backend/src/controllers/auth/*
  - backend/src/controllers/user/*
  - backend/src/middleware/authMiddleware.js
  - backend/src/db/models/userSessions.js

## Task 8 — Add Dockerfiles (backend and frontend)
- Description: Containerize both services for deployment and Compose/K8s usage.
- Acceptance Criteria (AC):
  - docker build succeeds for backend and frontend
  - Containers run and expose ports (backend: 9000, frontend: 80)
- Verification:
  ```sh
  # Backend image
  docker build -t launchpad-backend -f backend/Dockerfile .
  docker run --rm -p 9000:9000 --env-file backend/.env launchpad-backend

  # Frontend image
  docker build -t launchpad-frontend -f frontend/Dockerfile .
  docker run --rm -p 3000:80 launchpad-frontend
  ```
- Estimated Time: 20–30 minutes
- References:
  - Node official images: https://hub.docker.com/_/node
  - Nginx official images: https://hub.docker.com/_/nginx

## Task 9 — Create docker-compose.yml for local orchestration
- Description: Define services for mysql, backend, and frontend; wire networks and envs.
- Acceptance Criteria (AC):
  - docker compose up starts all services; frontend accessible at http://localhost:3000
  - Backend reachable at http://localhost:9000; no connection errors in logs
- Verification:
  ```sh
  docker compose up --build
  docker compose ps
  curl -s http://localhost:9000/health
  ```
- Estimated Time: 20–30 minutes
- References:
  - docs/hosting/README.md (local/macOS guidance)
  - Docker Compose: https://docs.docker.com/compose/

## Task 10 — Single-VM reverse proxy + TLS (optional)
- Description: Install and configure Caddy/Nginx to terminate TLS and route to services.
- Acceptance Criteria (AC):
  - Public domains resolve with valid TLS
  - Dashboard/API reachable at configured hostnames
- Verification:
  ```sh
  # Example (Caddy):
  caddy version
  caddy reload  # after placing Caddyfile
  # Browser: https://launchpad.yourcompany.com, https://launchpad-api.yourcompany.com
  ```
- Estimated Time: 20–30 minutes
- References:
  - docs/hosting/README.md (reverse proxy section)
  - https://caddyserver.com/docs/ | https://nginx.org/en/docs/

## Task 11 — Kubernetes with Helm (optional)
- Description: Deploy via Helm chart; expose ingress; configure DNS and TLS.
- Acceptance Criteria (AC):
  - Helm release installed; pods Running; ingress exposes frontend/API
  - DNS A records created; HTTPS functional
- Verification:
  ```sh
  helm repo add launchpad https://charts.launchpad.dev && helm repo update
  helm install launchpad launchpad/launchpad -n launchpad --create-namespace -f values.yaml
  kubectl get pods -n launchpad
  kubectl get ingress -n launchpad
  ```
- Estimated Time: 25–30 minutes
- References:
  - docs/hosting/README.md → Deploy on Kubernetes with Helm
  - https://helm.sh/docs/ | https://kubernetes.io/docs/

## Task 12 — Basic CI checks (optional)
- Description: Configure CI to build images and run basic checks; publish to registry.
- Acceptance Criteria (AC):
  - CI workflow builds backend/frontend images and (optionally) runs migrations
  - Images published to the container registry
- Verification:
  ```sh
  # Local validation before CI:
  docker build -t org/launchpad-backend:dev -f backend/Dockerfile .
  docker build -t org/launchpad-frontend:dev -f frontend/Dockerfile .
  ```
- Estimated Time: 25–30 minutes
- References:
  - GitHub Actions: https://docs.github.com/en/actions
  - Docker buildx: https://docs.docker.com/build/
  - sequelize-cli: https://sequelize.org/docs/v6/other-topics/migrations/

