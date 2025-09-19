---
type: "always_apply"
description: "Example description"
---

# Coding Standards

This document defines the coding standards for the Launchpad mono-repo.  
All contributors (human or AI) must follow these rules to ensure consistency, readability, and maintainability.

---

## 1. General Principles
- **Consistency > Individual Preference**: Follow established patterns within the codebase.
- **Readability > Cleverness**: Write simple, explicit code over "smart" but unreadable code.
- **Documentation**: Every module/function that is public-facing must have docstrings or comments.

---

## 2. Languages & Frameworks
- **Backend**: Node.js (TypeScript preferred)
- **Frontend**: React (with TypeScript)
- **Infrastructure/Deployment**: Helm charts + Kubernetes manifests + docker-compose

---

## 3. Code Style
- **TypeScript/JavaScript**:
  - Use `eslint` + `prettier` configs defined in the repo.
  - Prefer `async/await` over promises.
  - Use named exports over default exports (unless explicitly needed).
  - Interfaces > Types (when modeling data contracts).
- **React**:
  - Functional components with hooks. Avoid class components.
  - State management: `React Query` or `Redux Toolkit` (if specified).
  - File naming: `ComponentName.tsx`, styles as `ComponentName.module.css`.
- **Backend**:
  - REST/GraphQL routes must follow established versioning (`/api/v1/...`).
  - Proper error handling using standardized error classes.
  - Database migrations via approved tooling (e.g., Prisma/Migrations).
- **Infra**:
  - Helm charts must be linted and templated before merging.
  - Config values must be parameterized, not hardcoded.

---

## 4. Testing
- **Unit Tests** required for all new modules.
- **Integration Tests** where service interactions are involved.
- **Testing Frameworks**:
  - Jest (Frontend + Backend)
  - Playwright/Cypress (E2E, if needed)
- Minimum **coverage: 80%** per module.

---

## 5. Git & Commit Rules
- Branch naming:
  - `feature/<module>-<short-desc>`
  - `fix/<bug>-<short-desc>`
  - `chore/<task>`
- Commit messages:
  - Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):
    - `feat: add new API for projects`
    - `fix: correct Docker build context`
    - `docs: update setup instructions`
- PRs must be rebased, not squashed (unless explicitly mentioned).

---

## 6. Security
- Never commit secrets/tokens (use `.env` + Vault/Secret Manager).
- Validate all inputs on both client & server.
- Use HTTPS/TLS for all internal services.