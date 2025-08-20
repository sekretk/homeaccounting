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

## Ports

- Frontend (React): http://localhost:4200
- Backend (NestJS): http://localhost:3000