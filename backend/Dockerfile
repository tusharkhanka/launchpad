# Backend Dockerfile for Launchpad
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
# Install only production dependencies in the runtime image
RUN npm ci --omit=dev
COPY backend/. .
EXPOSE 9000
CMD ["npm", "start"]

