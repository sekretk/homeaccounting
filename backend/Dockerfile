# Backend Dockerfile for NestJS Application
# Multi-stage build for optimized production image

# === Build Stage ===
FROM node:20-alpine AS builder

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY tsconfig.base.json ./
COPY nx.json ./

# Copy workspace packages
COPY shared/ ./shared/
COPY backend/tsconfig*.json ./backend/
COPY backend/project.json ./backend/
COPY backend/webpack.config.js ./backend/

# Install all dependencies (including dev dependencies for build)
RUN npm ci --include=dev --legacy-peer-deps

# Copy backend source code
COPY backend/src/ ./backend/src/

# Build the shared package first (disable daemon for Docker builds)
RUN NX_DAEMON=false npx nx build shared

# Build the backend application
RUN NX_DAEMON=false npx nx build backend

# === Production Stage ===
FROM node:20-alpine AS production

# Install dumb-init and wget for proper signal handling and health checks
RUN apk add --no-cache dumb-init wget

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=nestjs:nodejs /app/dist/backend ./

# Install only production dependencies
RUN npm ci --only=production --legacy-peer-deps && npm cache clean --force

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the application with proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "main.js"]
