# Launchpad Self Hosting Guide <!-- omit in toc -->

Launchpad is designed from the ground up for easy self-hosting across multiple deployment options. Follow along to run Launchpad on your own infrastructure as a comprehensive Internal Developer Platform (IDP).

## Contents <!-- omit in toc -->

- [Objectives](#objectives)
- [Prerequisites](#prerequisites)
- [System Requirements](#system-requirements)
- [Deploy on a Linux virtual machine](#deploy-on-a-linux-virtual-machine)
  - [1. SSH into your VM](#1-ssh-into-your-vm)
  - [2. Clone the Launchpad repo](#2-clone-the-launchpad-repo)
  - [3. Run the `install.sh` script](#3-run-the-installsh-script)
  - [4. Configure and start your self hosted Launchpad instance](#4-configure-and-start-your-self-hosted-launchpad-instance)
  - [5. Setup a reverse proxy server](#5-setup-a-reverse-proxy-server)
  - [6. Setup DNS A records](#6-setup-dns-a-records)
  - [7. Access your Launchpad dashboard](#7-access-your-launchpad-dashboard)
- [Deploy on Kubernetes with Helm](#deploy-on-kubernetes-with-helm)
  - [Prerequisites for Kubernetes](#prerequisites-for-kubernetes)
  - [1. Add the Launchpad Helm repository](#1-add-the-launchpad-helm-repository)
  - [2. Configure your values file](#2-configure-your-values-file)
  - [3. Install Launchpad](#3-install-launchpad)
  - [4. Configure ingress and DNS](#4-configure-ingress-and-dns)
  - [5. Access your Kubernetes-deployed Launchpad](#5-access-your-kubernetes-deployed-launchpad)
- [Upgrade a Self Hosted Installation](#upgrade-a-self-hosted-installation)
- [Run on macOS locally](#run-on-macos-locally)
  - [System Requirements](#system-requirements-1)
  - [1. Clone the Launchpad repo](#1-clone-the-launchpad-repo)
  - [2. Run `config.sh` script to configure](#2-run-configsh-script-to-configure)
  - [3. Start the containers](#3-start-the-containers)
  - [4. Access your Launchpad dashboard](#4-access-your-launchpad-dashboard)
- [Frequently Asked Questions](#frequently-asked-questions)
  - [Q. Can I use podman instead of docker?](#q-can-i-use-podman-instead-of-docker)
  - [Q. I made some mistake and want to start the installation over?](#q-i-made-some-mistake-and-want-to-start-the-installation-over)
  - [Q. How to perform healthcheck of Launchpad services?](#q-how-to-perform-healthcheck-of-launchpad-services)
  - [Q. Can I host Launchpad behind a VPN?](#q-can-i-host-launchpad-behind-a-vpn)
  - [Q. How to configure GitOps integration?](#q-how-to-configure-gitops-integration)
  - [Q. How to add or update environment variables?](#q-how-to-add-or-update-environment-variables)
  - [Q. How to integrate with existing CI/CD pipelines?](#q-how-to-integrate-with-existing-cicd-pipelines)

## Objectives

- Self host Launchpad on a single VM instance, Kubernetes cluster, or locally on macOS
- Install and configure reverse proxy for secure access
- Create and configure OAuth applications for authentication
- Set up GitOps integration for automated deployments
- Configure CI/CD pipeline integrations
- Set up monitoring and observability stack

## Prerequisites

- Basic terminal/command line skills
- Basic text editor skills
- SSH access to a Cloud VM instance (for VM deployment)
- Kubernetes cluster access (for Kubernetes deployment)
- Ability to add DNS A records on your primary domain
- Ability to run commands with `sudo`
- `git` in your PATH
- External IP of the VM or Load Balancer IP

## System Requirements

### For Virtual Machine Deployment
- x86-64/amd64 Linux Virtual Machine
- Any one of the following supported Linux distributions
  - Ubuntu 24.04 LTS
  - Debian 12 (Bookworm)
  - RHEL 9 / Rocky Linux 9
- At least 8 vCPUs
- At least 32 GB RAM
- At least 200 GB of boot disk volume
- Port `80`, `443`, `6443` (if using embedded k3s), and `9090-9100` (monitoring) opened in firewall settings

### For Kubernetes Deployment
- Kubernetes cluster version 1.25+
- Helm 3.8+
- At least 16 GB RAM available across nodes
- At least 100 GB storage available
- Ingress controller installed (nginx, traefik, or similar)
- LoadBalancer service support (for cloud deployments)

## Deploy on a Linux virtual machine

Follow these step-by-step instructions to deploy Launchpad on a single Linux VM instance.

### 1. SSH into your VM

Deploy a Linux VM meeting the above system requirements on any popular Cloud hosting provider like Google Cloud Platform, AWS, or DigitalOcean. Once the machine is up and running, SSH into it following your cloud provider's instructions.

### 2. Clone the Launchpad repo

Let's start by moving to your home directory.

```sh
cd ~
```

Choose a git tag. You can find out the latest stable release tag from the [releases](https://github.com/yourorg/launchpad/releases) page.

> [!IMPORTANT]
>
> Always choose a tag matching the format `v[MAJOR].[MINOR].[PATCH]`, for example: `v1.2.3`.
> These tags are tailored for self host deployments.

Clone the repository with git and change to the `launchpad` directory. Replace `GIT-TAG` with your chosen git tag.

```sh
git clone https://github.com/yourorg/launchpad.git -b GIT-TAG && cd launchpad
```

### 3. Run the `install.sh` script

Next, change into the `self-host` directory. All successive commands will be run from this directory.

```sh
cd self-host
```

Run the install script with `sudo`.

```sh
sudo ./install.sh
```

> [!NOTE]
>
> To use **podman** instead of **docker**, use the *--podman* flag.
>
> ```sh
> sudo ./install.sh --podman
> ```
>
> To install with embedded k3s for container orchestration, use the *--k3s* flag.
>
> ```sh
> sudo ./install.sh --k3s
> ```

The Launchpad install script will check your system's requirements and start the installation. It can take a few minutes to complete.

### 4. Configure and start your self hosted Launchpad instance

During installation, you'll be presented with the Launchpad configuration wizard.

For the first prompt, it'll ask for a namespace for your organization. This typically will be your company's name.

For the next prompt, you'll be asked to enter the URL to access Launchpad's web dashboard. Typically, this might look like a subdomain on your primary domain, for example, if your domain is `yourcompany.com`, enter `https://launchpad.yourcompany.com`.

Next, you'll be asked to enter the URL to access Launchpad's API endpoint. Typically, this might look like, `https://launchpad-api.yourcompany.com`.

For the next few prompts, you'll need to obtain OAuth Application credentials for authentication. Launchpad supports multiple OAuth providers:

- [Create a Google OAuth App](./docs/google-oauth.md)
- [Create a GitHub OAuth App](./docs/github-oauth.md)
- [Create an Azure AD OAuth App](./docs/azure-oauth.md)
- [Create an Okta OAuth App](./docs/okta-oauth.md)

You'll also need to configure:

- **Git Integration**: GitHub, GitLab, or Bitbucket credentials for repository management
- **Container Registry**: DockerHub, GitHub Container Registry, or AWS ECR credentials
- **Cloud Provider**: AWS, GCP, or Azure credentials for infrastructure provisioning
- **Monitoring**: Prometheus and Grafana configuration
- **SMTP**: Email provider for notifications and alerts

Once completed, the install script will attempt to start all the Launchpad services. You should see a confirmation that all services are running.

### 5. Setup a reverse proxy server

We recommend using [Caddy](https://caddyserver.com) for routing incoming requests. For Kubernetes environments, use an ingress controller instead.

Change to your home directory.

```sh
cd ~
```

Run the following commands to install Caddy:

```sh
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl && \
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg && \
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list && \
sudo apt update && \
sudo apt install caddy
```

Create a `~/Caddyfile` config:

```sh
cat <<EOF > ~/Caddyfile
launchpad.yourcompany.com {
	reverse_proxy http://localhost:3000
}

launchpad-api.yourcompany.com {
	reverse_proxy http://localhost:8080
}

# Monitoring endpoints
monitoring.yourcompany.com {
	reverse_proxy http://localhost:3001
}

grafana.yourcompany.com {
	reverse_proxy http://localhost:3002
}
EOF
```

Reload Caddy:

```sh
caddy reload
```

### 6. Setup DNS A records

Obtain your VM's external IP address and create A records for:

```
launchpad.yourcompany.com          IN A        101.102.103.104
launchpad-api.yourcompany.com      IN A        101.102.103.104
monitoring.yourcompany.com         IN A        101.102.103.104
grafana.yourcompany.com            IN A        101.102.103.104
```

### 7. Access your Launchpad dashboard

Visit `https://launchpad.yourcompany.com` to access your dashboard and sign in to continue.

## Deploy on Kubernetes with Helm

Launchpad provides a comprehensive Helm chart for Kubernetes deployment with full GitOps capabilities.

### Prerequisites for Kubernetes

- Kubernetes 1.25+
- Helm 3.8+
- An ingress controller (nginx, traefik, etc.)
- A storage class for persistent volumes
- Optional: cert-manager for automatic TLS certificates

### 1. Add the Launchpad Helm repository

```sh
helm repo add launchpad https://charts.launchpad.dev
helm repo update
```

### 2. Configure your values file

Create a `values.yaml` file with your specific configuration:

```yaml
# values.yaml
global:
  domain: yourcompany.com
  
ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  tls:
    enabled: true

auth:
  providers:
    github:
      clientId: "your-github-client-id"
      clientSecret: "your-github-client-secret"
    google:
      clientId: "your-google-client-id"
      clientSecret: "your-google-client-secret"

gitops:
  enabled: true
  provider: argocd  # or flux
  
monitoring:
  prometheus:
    enabled: true
  grafana:
    enabled: true
    adminPassword: "secure-password"

database:
  type: postgresql
  persistence:
    size: 20Gi

redis:
  persistence:
    size: 8Gi
```

### 3. Install Launchpad

```sh
helm install launchpad launchpad/launchpad \
  --namespace launchpad \
  --create-namespace \
  --values values.yaml
```

### 4. Configure ingress and DNS

Get your ingress controller's external IP:

```sh
kubectl get svc -n ingress-nginx
```

Create DNS A records pointing to this IP for:
- `launchpad.yourcompany.com`
- `launchpad-api.yourcompany.com`
- `grafana.yourcompany.com`

### 5. Access your Kubernetes-deployed Launchpad

Once DNS propagates, visit `https://launchpad.yourcompany.com` to access your Launchpad instance.

## Upgrade a Self Hosted Installation

To upgrade to a specific or latest version of Launchpad:

```sh
cd ~/launchpad
git reset --hard
git fetch --tags
git checkout v1.2.3  # replace with desired version
cd self-host
sudo ./install.sh
```

For Kubernetes deployments:

```sh
helm repo update
helm upgrade launchpad launchpad/launchpad --values values.yaml
```

## Run on macOS locally

You can run Launchpad locally on macOS for development and testing.

> [!WARNING]
>
> ### macOS Compatibility
>
> This setup is intended for development and testing only. Don't use for production.

### System Requirements

| Name           | Version  |
| -------------- | -------- |
| Docker Desktop | v4.20+   |
| Docker Compose | v2.20+   |
| Node.js        | v18+     |
| Go             | v1.21+   |

### 1. Clone the Launchpad repo

```sh
git clone https://github.com/yourorg/launchpad.git -b GIT-TAG && cd launchpad/self-host
```

### 2. Run `config.sh` script to configure

```sh
./config.sh --local
```

This will configure Launchpad for local development with sensible defaults.

### 3. Start the containers

```sh
docker compose -f compose.yml -f compose.local.yml up --build
```

### 4. Access your Launchpad dashboard

Visit [http://localhost:3000](http://localhost:3000) to access your dashboard.

## Frequently Asked Questions

### Q. Can I use podman instead of docker?

Yes, use the `--podman` flag when running the installation script.

### Q. I made some mistake and want to start the installation over?

From the `self-host` directory:

```sh
sudo docker compose down --rmi --remove-orphans --volumes
rm -rf ~/launchpad
```

Then repeat the installation process.

### Q. How to perform healthcheck of Launchpad services?

Frontend health check:
```sh
curl -s https://launchpad.yourcompany.com/health | grep "ok"
```

API health check:
```sh
curl -s https://launchpad-api.yourcompany.com/health | grep "healthy"
```

### Q. Can I host Launchpad behind a VPN?

Yes! The dashboard can be behind a VPN, but ensure the API endpoints remain accessible for CI/CD integrations and webhooks.

### Q. How to configure GitOps integration?

Launchpad supports ArgoCD and Flux. Configure during installation or update the `.env` file:

```
GITOPS_PROVIDER=argocd
ARGOCD_SERVER=https://argocd.yourcompany.com
ARGOCD_TOKEN=your-token
```

### Q. How to add or update environment variables?

Update the environment files:
- `self-host/.env` - Backend services
- `frontend/.env.local` - Frontend configuration

Then restart services:

```sh
sudo docker compose down && sudo ./install.sh
```

### Q. How to integrate with existing CI/CD pipelines?

Launchpad provides webhooks and API endpoints for integration:

- **Jenkins**: Use the Launchpad Jenkins plugin
- **GitHub Actions**: Use the provided action in `.github/workflows/`
- **GitLab CI**: Use the example `.gitlab-ci.yml` template
- **Custom**: Use the REST API documented at `/api/docs`