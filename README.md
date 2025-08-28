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

- Docker and Docker Compose (for local development)

### Local Development Database

The project includes Docker setup for local PostgreSQL development:

```bash
# Start PostgreSQL database
npm run db:up

# Stop PostgreSQL database
npm run db:down

# View database logs
npm run db:logs
```

**Alternative setup options:**

1. **Using Docker Compose** (if available):
   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```

2. **Using direct Docker commands**:
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

## Ports

- Frontend (React): http://localhost:4200
- Backend (NestJS): http://localhost:3000
- PostgreSQL: localhost:5432