# Deploy Launchpad with Helm on Kubernetes (Optional)

This guide shows how to deploy the Launchpad stack (MySQL, backend, frontend) using the provided Helm chart.

## Prerequisites
- A Kubernetes cluster (Kind, Minikube, k3d, EKS/GKE/AKS, etc.)
- kubectl and helm installed
- An Ingress controller (e.g., NGINX Ingress) if you plan to expose via Ingress
- Container images published to a registry accessible by the cluster, or images loaded locally (Kind)

## Chart location
- Chart: `helm/launchpad`
- Components deployed:
  - MySQL (Deployment + PVC optional)
  - Backend (Deployment + Service)
  - Frontend (Deployment + Service)
  - Optional Ingress (frontend at `/`, API at `/api` and `/health`)

## Image configuration
By default, values point to `launchpad-backend:latest` and `launchpad-frontend:latest`.
Update these to your registry images before installing:

Example override file `values.override.yaml`:
```
image:
  backend:
    repository: ghcr.io/<org>/launchpad-backend
    tag: "<tag>"
  frontend:
    repository: ghcr.io/<org>/launchpad-frontend
    tag: "<tag>"
```

If using Kind, you can load local images:
```
kind load docker-image launchpad-backend:latest
kind load docker-image launchpad-frontend:latest
```

## Database and secrets
The chart creates two Secrets:
- `<release>-mysql-secret` (rootPassword, database, username, password)
- `<release>-backend-secret` (jwtSecret, googleClientId)

Override defaults in `values.override.yaml`:
```
mysql:
  database: launchpad
  username: launchpad
  password: launchpad
  rootPassword: root

backend:
  env:
    JWT_SECRET: "change-me"
    GOOGLE_CLIENT_ID: "change-me"
```

## Optional: Ingress + TLS
Enable ingress and set host:
```
ingress:
  enabled: true
  className: nginx
  host: app.local
  tls:
    enabled: false
```

- For TLS via cert-manager, add appropriate annotations and set `tls.enabled: true` and `tls.secretName` (the cert-manager-created secret).

## Install
Choose a namespace (`launchpad` in this example):
```
kubectl create ns launchpad || true
helm upgrade --install launchpad helm/launchpad -n launchpad -f values.override.yaml
```

## Verify
- Pods & Services:
```
kubectl get pods,svc -n launchpad
```
- Port-forward backend (if no Ingress):
```
kubectl -n launchpad port-forward svc/launchpad-backend 9000:9000 &
curl -i http://localhost:9000/health
```
- Port-forward frontend (if no Ingress):
```
kubectl -n launchpad port-forward svc/launchpad-frontend 3000:80 &
curl -I http://localhost:3000/
```
- If Ingress enabled and host resolves to your ingress controller:
```
curl -I http://app.local/
curl -I http://app.local/health
```

## Notes
- The MySQL Deployment uses an optional PVC (`mysql.persistence.enabled`). For production, set it to `true` and provide a `storageClassName` if needed.
- For production, scale replicas and add resources/requests/limits in values.
- You may remove NodePort/LoadBalancer exposures and rely solely on Ingress for external access.

