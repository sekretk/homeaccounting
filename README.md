# Home Accounting - Nx Monorepo

[![CI](https://github.com/ksekret/homeaccounting/actions/workflows/ci.yml/badge.svg)](https://github.com/ksekret/homeaccounting/actions/workflows/ci.yml)
[![Build and Test All](https://github.com/ksekret/homeaccounting/actions/workflows/build-and-test.yml/badge.svg)](https://github.com/ksekret/homeaccounting/actions/workflows/build-and-test.yml)

For keeping books for home accounting

## Project Structure

This is an Nx monorepo containing:

- **frontend**: React application (Vite + React Router)
- **backend**: NestJS application 
- **shared**: Shared TypeScript library for common types and utilities
- **frontend-e2e**: End-to-end tests for the frontend (Playwright)
- **backend-e2e**: End-to-end tests for the backend (Jest)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```bash
npm install
```

## Development Commands

### Running Applications

```bash
# Start the React frontend (runs on http://localhost:4200)
npx nx serve frontend

# Start the NestJS backend (runs on http://localhost:3000)
npx nx serve backend

# Run both frontend and backend concurrently
npx nx run-many -t serve -p frontend backend
```

### Building Applications

```bash
# Build the frontend
npx nx build frontend

# Build the backend
npx nx build backend

# Build the shared library
npx nx build shared

# Build all projects
npx nx run-many -t build
```

### Testing

```bash
# Run unit tests for frontend
npx nx test frontend

# Run unit tests for backend
npx nx test backend

# Run unit tests for shared library
npx nx test shared

# Run all unit tests
npx nx run-many -t test

# Run e2e tests
npx nx e2e frontend-e2e
npx nx e2e backend-e2e
```

### Linting & Formatting

```bash
# Lint all projects
npx nx run-many -t lint

# Format code with Prettier
npx nx format:write
```

## Project Commands

### View project details
```bash
npx nx show project frontend
npx nx show project backend
npx nx show project shared
```

### Generate new components/services
```bash
# Generate a React component in frontend
npx nx g @nx/react:component my-component --project=frontend

# Generate a NestJS service in backend
npx nx g @nx/nest:service my-service --project=backend

# Generate a utility function in shared library
npx nx g @nx/js:library my-util --project=shared
```

## CI/CD with GitHub Actions

This project includes comprehensive GitHub Actions workflows:

### 🔄 **Continuous Integration** (`.github/workflows/ci.yml`)
- Triggers on pushes and pull requests to `main` and `develop` branches
- Runs on Node.js 18.x and 20.x matrix
- Uses Nx affected commands for efficiency (only runs tasks for changed projects)
- Includes lint, test, build, and e2e steps
- Uploads code coverage reports

### 🏗️ **Build and Test All** (`.github/workflows/build-and-test.yml`)  
- Manual trigger and daily scheduled runs
- Builds and tests ALL projects (not just affected)
- Generates project dependency graph
- Comprehensive artifact uploads
- Perfect for full system validation

### 🔧 **Dependency Management** (`.github/dependabot.yml`)
- Automated weekly npm dependency updates
- Monthly GitHub Actions updates
- Auto-assigns PRs and includes proper commit prefixes

## Nx Cloud

This workspace is set up with Nx Cloud for distributed caching and CI optimization.
Visit https://cloud.nx.app/connect/yFWgYwkt2J to complete the setup.

## CI/CD Pipeline

### GitHub Actions Workflows

This project includes comprehensive CI/CD pipelines:

#### **Main CI Pipeline** (`.github/workflows/ci.yml`)
- **Triggers**: Push to `main`/`develop` branches, Pull Requests
- **Matrix Testing**: Node.js 18.x and 20.x
- **Steps**:
  - Lint affected projects
  - Test affected projects with coverage
  - Build affected projects  
  - Run E2E tests
  - Upload test results and coverage reports

#### **Pull Request Checks** (`.github/workflows/pr.yml`)
- **Triggers**: PR opened, synchronized, or reopened
- **Features**:
  - Fast feedback on code changes
  - Only runs on affected projects (Nx affected)
  - Automated PR comments with check status
  - Code formatting validation

#### **Dependency Management** 
- **Dependabot** configured for weekly dependency updates
- **Grouped updates** for related packages (Nx, React, NestJS, etc.)
- **Automated security updates**

### NPM Scripts

The following scripts are available for local development and CI:

```bash
# Development
npm start              # Start frontend only
npm run start:backend  # Start backend only  
npm run start:all      # Start both frontend and backend

# Building
npm run build          # Build all projects
npm run affected:build # Build only affected projects

# Testing
npm test              # Test all projects
npm run test:watch    # Test with watch mode
npm run test:e2e      # Run E2E tests
npm run affected:test # Test only affected projects

# Code Quality
npm run lint          # Lint all projects
npm run lint:fix      # Lint and fix issues
npm run format        # Format code with Prettier
npm run format:check  # Check code formatting

# Utilities
npm run graph         # Visualize project dependencies
npm run clean         # Reset Nx cache
```

## Architecture

- **Frontend (React)**: Modern React app with Vite bundler, React Router, and TypeScript
- **Backend (NestJS)**: Scalable Node.js backend with TypeScript, decorators, and dependency injection
- **Shared Library**: Common TypeScript code, interfaces, and utilities shared between frontend and backend
- **Monorepo Benefits**: 
  - Shared dependencies and tooling
  - Atomic commits across related changes
  - Consistent code style and linting
  - Efficient build caching with Nx

## Database Setup

This project uses PostgreSQL as the database with TypeORM for object-relational mapping.

### Prerequisites

- **Docker**: Choose one of:
  - **Docker Desktop** (Windows/macOS/Linux)
  - **Colima** (macOS alternative): `brew install colima docker`
  - **Podman** or other Docker-compatible runtime

### Local Development Database

The project includes Docker setup for local PostgreSQL development:

**Option 1: Using npm scripts (recommended)**
```bash
# Start PostgreSQL database
npm run db:up

# Stop PostgreSQL database
npm run db:down

# View database logs
npm run db:logs
```

**Option 2: Using Docker Compose** (full development environment):
```bash
# Make sure Docker/Colima is running
colima start  # For macOS Colima users

# Start all services including database
docker compose up -d postgres

# Or start everything
docker compose up --build
```

**Option 3: Direct Docker commands**:
```bash
docker run -d --name homeaccounting-postgres \
  -p 5432:5432 \
  -e POSTGRES_DB=homeaccounting \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  postgres:15
```

3. **Using local PostgreSQL installation**:
   - Install PostgreSQL locally
   - Create database: `createdb homeaccounting`
   - Update `.env` with your local credentials

### Database Configuration

The database connection is configured through environment variables:

```bash
# Copy the example environment file (create manually)
# .env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=homeaccounting
NODE_ENV=development
PORT=3333
RUN_MIGRATIONS=true
RUN_SEEDS=true
```

### Database Management

- **PostgreSQL**: Runs on `localhost:5432`
- Use your preferred PostgreSQL client (pgAdmin, TablePlus, DBeaver, etc.) to manage the database

### Features

- **TypeORM**: Entity management with automatic migrations in development
- **Entity Example**: Account entity with support for different account types
- **Database Extensions**: UUID support for primary keys
- **Connection Pooling**: Optimized for production environments

### Schema Management

This project uses SQL-based migrations for database schema management with an integrated seeding system:

**Migration System:**
- **File Format**: Plain SQL files for maximum compatibility and portability
- **Development**: Migrations run automatically on app startup
- **Production**: Manual migration control via environment variables
- **Location**: `database/migrations/` (root level)
- **Seeds**: Each migration can have a corresponding seed file in `database/seeds/`

**Migration Commands:**
```bash
# Create a new migration with template
npm run migration:create my_migration_name

# Check migration status (see backend logs)
npm run migration:status

# Force run seeds manually
npm run db:seed
```

**File Structure:**
```
database/
├── migrations/
│   ├── 001_create_accounts_table.sql
│   └── 002_create_users_table.sql
└── seeds/
    ├── 001_accounts_seed.sql
    └── 002_users_seed.sql
```

**Creating Migrations:**

1. **Create migration files:**
   ```bash
   npm run migration:create create_users_table
   ```

2. **Edit the migration file** (`database/migrations/002_create_users_table.sql`):
   ```sql
   -- Migration: create_users_table
   -- Created: 2024-01-01
   -- Description: Creates the users table
   
   CREATE TABLE users (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       name VARCHAR(255) NOT NULL,
       email VARCHAR(255) UNIQUE NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   
   CREATE INDEX idx_users_email ON users(email);
   ```

3. **Edit the seed file** (`database/seeds/002_create_users_table_seed.sql`):
   ```sql
   -- Seed: create_users_table sample data
   -- Migration: 002_create_users_table.sql
   
   INSERT INTO users (name, email) 
   SELECT * FROM (VALUES
       ('John Doe', 'john@example.com'),
       ('Jane Smith', 'jane@example.com')
   ) AS v(name, email)
   WHERE NOT EXISTS (SELECT 1 FROM users);
   ```

**Migration Features:**
- **Automatic Execution**: Pending migrations run on app startup in development
- **Transaction Safety**: Each migration runs in a database transaction
- **Tracking**: Migration execution is tracked in the `migrations` table
- **Sequential**: Migrations are executed in numerical order
- **Idempotent**: Safe to run multiple times

**Environment Variables:**
- `RUN_MIGRATIONS=true` - Force run migrations in production
- `RUN_SEEDS=true` - Force run seeds
- `RUN_SEEDS=false` - Skip seeds in development
- `NODE_ENV=development` - Enable auto-migrations and default seeding

## Kubernetes Development Setup

This project uses **Kubernetes for both development and production**, providing a consistent container orchestration experience. We use **Colima** in Kubernetes mode for local development.

### Prerequisites

- **Colima**: `brew install colima`
- **kubectl**: `brew install kubectl`
- **Docker**: Installed with Colima

### Quick Start

**Start the full development environment:**

```bash
# For Colima users (macOS)
colima start

# For Docker Desktop users - start Docker Desktop app

# Verify Docker is running
docker info
```

**Then start the services:**

```bash
# Check if Docker is running (helpful script)
npm run docker:check

# Start Docker/Colima automatically
npm run docker:start

# Start all services in development mode (modern Docker Compose)
docker compose up --build

# Alternative: use our wrapper script that checks Docker first
npm run docker:compose -- up --build

# Start specific service
docker compose up postgres backend

# View logs
docker compose logs -f backend
```

**Production**: Production deployment is handled via Kubernetes. See the `helm-charts/` directory for Kubernetes configurations.

### Docker Services

#### 🐘 PostgreSQL Database
- **Port**: 5432
- **Database**: homeaccounting
- **User**: postgres
- **Password**: password (development)

#### 🚀 Backend (NestJS)
- **Port**: 3000
- **Framework**: NestJS with TypeORM
- **Database**: PostgreSQL
- **Health Check**: Built-in health check at `/health`

#### 🌐 Frontend (React)
- **Port**: 4200 (mapped to container port 80)
- **Framework**: React with Vite
- **Server**: Nginx
- **Proxy**: API requests proxied to backend

### Docker Files Structure

```
├── docker-compose.yml              # Complete development configuration
├── backend/
│   ├── Dockerfile                  # Backend container
│   └── .dockerignore              # Backend build exclusions
└── frontend/
    ├── Dockerfile                  # Frontend container  
    ├── .dockerignore              # Frontend build exclusions
    └── nginx.conf                 # Nginx configuration
```

### Docker Environment Variables

#### Backend
- `NODE_ENV`: development
- `DEBUG`: Debug logging pattern
- `DATABASE_HOST`: Database hostname (postgres)
- `DATABASE_PORT`: Database port (5432)
- `DATABASE_NAME`: Database name (homeaccounting)
- `DATABASE_USER`: Database username (postgres)
- `DATABASE_PASSWORD`: Database password (password)

### Docker Volumes

#### Persistent Volumes
- `postgres_data`: PostgreSQL data persistence

#### Development Volume Mounts (for hot reloading)
- `./backend/src` → `/app/backend/src` (Backend source code)
- `./frontend/src` → `/app/frontend/src` (Frontend source code)  
- `./shared/src` → `/app/shared/src` (Shared code)
- Package files mounted for dependency updates

### Docker Networks

- `homeaccounting-network`: Bridge network for service communication

### Docker Health Checks

All services include health checks:
- **PostgreSQL**: `pg_isready` command
- **Backend**: NestJS health endpoint at `/health`
- **Frontend**: Nginx health endpoint

### Docker Development Workflow

1. **Start development environment:**
   ```bash
   docker compose up --build
   ```

2. **View logs:**
   ```bash
   docker compose logs -f
   ```

3. **Execute commands in containers:**
   ```bash
   # Backend container
   docker compose exec backend npm run migration:run
   
   # Database container
   docker compose exec postgres psql -U postgres homeaccounting
   ```

4. **Rebuild specific service:**
   ```bash
   docker compose build backend
   docker compose up -d backend
   ```

### Docker Troubleshooting

#### Colima Not Running (macOS)
If you see "Cannot connect to the Docker daemon" error:
```bash
# Check if Colima is running
colima status

# Start Colima if not running
colima start

# If you have issues, restart Colima
colima stop && colima start

# For persistent issues, delete and recreate Colima
colima delete
colima start --cpu 4 --memory 8

# Verify Docker is working
docker info
```

#### Port Conflicts
If you get port conflicts, stop conflicting services:
```bash
# Stop existing PostgreSQL
docker stop homeaccounting-postgres || true

# Or use different ports in docker-compose.yml
```

#### Build Issues
```bash
# Clean build (no cache)
docker compose build --no-cache

# Remove all containers and volumes
docker compose down -v
docker system prune -a
```

#### Database Issues
```bash
# Reset database
docker compose down -v
docker volume rm homeaccounting_postgres_data
docker compose up postgres
```

#### Logs
```bash
# View all logs
docker compose logs

# Follow specific service logs
docker compose logs -f backend

# View recent logs
docker compose logs --tail=50 frontend
```

### Docker Security Notes

- Containers use non-root users for security
- Security headers are configured in Nginx
- Health checks prevent routing to unhealthy containers
- For production security, see Kubernetes configurations in `helm-charts/`

### Docker Performance

#### Container Optimizations
- Multi-stage Docker builds reduce image size
- Nginx serves static files efficiently
- Health checks ensure service availability

#### Development Features
- Volume mounts for hot reloading
- Development-specific environment variables
- Easier debugging and testing

## Ports

- Frontend (React): http://localhost:4200
- Backend (NestJS): http://localhost:3000
- PostgreSQL: localhost:5432