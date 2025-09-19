---
type: "manual"
description: "Example description"
---

<!-- ##Project Guidelines

This document defines repository structure, local setup, deployment, branching workflow, and documentation practices for the Launchpad mono-repo.

⸻

1. Repository structure

/launchpad
  /frontend      # React + TypeScript
  /backend       # Node.js + TypeScript
  /infra         # Helm charts, Kubernetes manifests
  /scripts       # Setup & automation scripts
  /docs          # Documentation


⸻

2. Local setup

Prerequisites
	•	Node.js (LTS)
	•	pnpm (preferred package manager) — or npm/yarn if necessary
	•	Docker & Docker Compose
	•	Kubernetes (minikube / kind / local cluster)
	•	Helm
	•	kubectl

Quick start (local)

# clone
git clone <repo-url>
cd launchpad

# install dependencies for all workspaces
pnpm install --recursive

# copy env examples (adjust per service)
cp .env.example .env

# run backend (from repo root, using workspace filter)
pnpm --filter backend dev

# run frontend
pnpm --filter frontend dev

# optional: run both with Docker Compose
docker-compose up

Notes
	•	Keep .env out of version control. Use .env.example to document required vars.
	•	Use pnpm workspaces to manage packages across the mono-repo.
	•	Prefer running services in containers when testing feature parity with CI/CD environments.

⸻

3. Deployment
	•	Deployment is Kubernetes-first via Helm charts. Each deployable module must have a chart under /infra.
	•	Images must be versioned (semantic version or commit-tag) and published to the agreed container registry.
	•	Use a GitOps flow (e.g., Argo CD) or a CD pipeline to apply Helm releases to environments.

Typical deployment workflow
	1.	Run CI to validate builds, tests, linting, and Helm linting.
	2.	Build and push container images (tagged).
	3.	Update Helm image tags / chart values in the release manifest (automated or PR).
	4.	GitOps/CD picks up the change and deploys to the target cluster.
	5.	Smoke tests / health checks run post-deploy.

Helm & infra rules
	•	Values must be parameterized; avoid hardcoded secrets/configs.
	•	Use Helm linting and --dry-run validation as part of CI.
	•	Maintain separate values files for each environment (values.dev.yaml, values.staging.yaml, values.prod.yaml).
	•	Keep secrets in a secret manager (sealed-secrets, Vault, SSM Parameter Store, etc.).

⸻

4. Branching & workflow
	•	main — production-ready (protected branch).
	•	staging / integration branch.
	•	Feature branches: feature/<module>-<short-desc> → PR into develop.
	•	Fix branches: fix/<module>-<short-desc> → PR into develop (or main if hotfix).
	•	Release branches: release/x.y.z → prepare release → merged to main and develop.

PR rules
	•	Each PR must have a clear description, link to related issue, and list of changes.
	•	Run CI on every PR; successful CI required before merge.
	•	Use protected branches and require at least 1–2 reviewers (configurable by repo rules).
	•	Prefer small, focused PRs to simplify review and testing.

⸻

5. Documentation
	•	Every top-level module must include a README.md that explains purpose, local run steps, and configuration.
	•	API changes must be documented under /docs/api (OpenAPI / Swagger where applicable).
	•	Helm/infra changes must update /docs/deployment with deployment notes and environment-specific guidance.
	•	Keep architecture diagrams, runbooks, and troubleshooting steps in /docs (markdown or linked diagrams).

⸻

6. CI / Quality gates
	•	Linting (eslint, prettier) and formatting must run in CI and be required for merges.
	•	Unit tests and integration tests must run; define minimum coverage thresholds per module.
	•	Helm lint and kubectl --dry-run validations should run for infra changes.
	•	Security checks / SCA (software composition analysis) should run periodically or per-PR.

⸻

7. Miscellaneous
	•	Use a shared CONTRIBUTING.md to document onboarding steps and contributor rules.
	•	Centralize shared code (utilities, types, components) in a /packages or shared workspace if needed.
	•	Keep infra and application configuration clearly separated.
	•	Maintain a changelog for major releases (e.g., CHANGELOG.md or GitHub Releases). -->
