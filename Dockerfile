# ==============================================================================
# ImpactGrid Production Multi-Stage Distroless Dockerfile
# Targeted for: Telkom Cloud Sentul & Surabaya Private Kubernetes Clusters
# Compliance: PP No. 71/2019, ISO 27001, CIS Docker Benchmark
# ==============================================================================

# --- Stage 1: Build Frontend SPA ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install dependencies strictly from lockfile
RUN npm ci

# Copy full application source code
COPY . .

# Build production assets
RUN npm run build

# Prune devDependencies for production runtime
RUN npm prune --production

# --- Stage 2: Hardened Distroless Production Runtime ---
FROM gcr.io/distroless/nodejs20-debian12:nonroot

WORKDIR /app

# Run as non-root user (nonroot:nonroot = 65532:65532)
USER 65532:65532

# Copy production node_modules and package.json
COPY --from=builder --chown=65532:65532 /app/node_modules ./node_modules
COPY --from=builder --chown=65532:65532 /app/package.json ./package.json

# Copy compiled frontend distribution
COPY --from=builder --chown=65532:65532 /app/dist ./dist

# Copy enterprise server core, proxy and entrypoint
COPY --from=builder --chown=65532:65532 /app/server ./server
COPY --from=builder --chown=65532:65532 /app/server.js ./server.js

# Expose application port (3000 for standard dev/prod, 8080 for Cloud Run)
EXPOSE 3000 8080

# Production Environment Variables
ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0 \
    DATA_CENTER_PRIMARY=telkom-dc-sentul \
    DATA_CENTER_DR=telkom-dc-surabaya

# Entrypoint executes hardened full-stack server
CMD ["server.js"]
