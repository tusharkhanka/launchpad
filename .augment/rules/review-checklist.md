---
type: "agent_requested"
description: "Example description"
---

## 1. Code Quality
- [ ] Code follows **Coding Standards**.
- [ ] Code is readable, modular, and documented.
- [ ] No dead code, commented-out blocks, or TODOs left unresolved.

---

## 2. Functionality
- [ ] Code works as intended and meets requirements.
- [ ] Edge cases handled (null, empty, error states).
- [ ] No breaking changes unless explicitly documented.

---

## 3. Testing
- [ ] Unit tests included for all new logic.
- [ ] Integration/E2E tests updated (if applicable).
- [ ] All tests pass in CI.

---

## 4. Security & Performance
- [ ] No secrets committed.
- [ ] Input validation and sanitization present.
- [ ] Query/API calls optimized, no N+1 issues.
- [ ] Resource usage efficient (CPU/memory).

---

## 5. Infrastructure/Deployment
- [ ] Dockerfiles follow base template.
- [ ] Helm values parameterized (no hardcoding).
- [ ] CI/CD workflows updated if needed.

---

## 6. Documentation
- [ ] Updated README/docs for any new/changed features.
- [ ] API docs updated.
- [ ] Clear instructions for setup or usage.

---

## 7. Git & Process
- [ ] Branch name follows convention.
- [ ] Commit messages follow **Conventional Commits**.
- [ ] PR linked to related issue/ticket.
- [ ] Reviewer(s) assigned.