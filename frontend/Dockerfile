# Frontend Dockerfile for Launchpad (CRA)
FROM node:18-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
# Install all dependencies (including dev) required for the build
RUN npm ci --legacy-peer-deps
COPY frontend/. .
RUN npm run build

FROM nginx:1.25-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80

