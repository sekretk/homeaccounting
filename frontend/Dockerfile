# Frontend Dockerfile for React/Vite Application
# Multi-stage build with Nginx serving

# === Build Stage ===
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY tsconfig.base.json ./
COPY nx.json ./

# Copy workspace packages
COPY shared/ ./shared/
COPY frontend/tsconfig*.json ./frontend/
COPY frontend/project.json ./frontend/
COPY frontend/vite.config.ts ./frontend/

# Install all dependencies (including dev dependencies for build)
RUN npm ci --include=dev --legacy-peer-deps

# Copy frontend source code
COPY frontend/src/ ./frontend/src/
COPY frontend/index.html ./frontend/
COPY frontend/public/ ./frontend/public/

# Build the shared package first
RUN npx nx build shared

# Build the frontend application
RUN npx nx build frontend

# === Production Stage ===
FROM nginx:alpine AS production

# Create nginx user for security
RUN addgroup -g 1001 -S nginx-app && \
    adduser -S nginx-app -u 1001

# Copy built application from builder stage
COPY --from=builder /app/dist/frontend /usr/share/nginx/html

# Copy custom nginx configuration
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Set proper permissions
RUN chown -R nginx-app:nginx-app /usr/share/nginx/html && \
    chown -R nginx-app:nginx-app /var/cache/nginx && \
    chown -R nginx-app:nginx-app /var/log/nginx && \
    chown -R nginx-app:nginx-app /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx-app:nginx-app /var/run/nginx.pid

# Switch to non-root user
USER nginx-app

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
