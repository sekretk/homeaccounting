# 🗄️ Migration System

## Overview

We've implemented a flexible migration system that can be used both within the NestJS application and as an external CLI tool. The system uses shared core logic to ensure consistency between both approaches.

## Architecture

### Shared Migration Core (`shared/src/lib/migration-core.ts`)
- **MigrationCore class**: Contains all migration logic
- **Database-agnostic**: Works with any TypeORM DataSource
- **Configurable**: Accepts custom paths and logger
- **Transaction-safe**: All migrations run in transactions
- **Rollback support**: Can rollback migrations with DOWN sections

### NestJS Integration (`backend/src/database/sql-migration.service.ts`)
- Automatically runs migrations on application bootstrap
- Uses the shared `MigrationCore` class
- Integrates with NestJS dependency injection
- Provides methods for manual migration control

### CLI Tool (`scripts/migrate.ts`)
- Standalone migration runner
- Full CLI argument parsing
- Supports multiple commands and options
- Uses the same shared core logic

## Usage

### CLI Commands

```bash
# Show migration status
npm run migrate:status

# Run all pending migrations
npm run migrate:run

# Run seed files
npm run migrate:seeds

# Rollback a specific migration
npm run migrate:rollback --migration 001_create_accounts_table.sql

# Show help
npm run migrate help
```

### CLI Options

```bash
# Connect to different database
npm run migrate status --host prod.example.com --database myapp

# Enable verbose logging
npm run migrate status --verbose

# Custom paths
npm run migrate run --migrations-path /custom/path --seeds-path /custom/seeds
```

### Environment Variables

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=homeaccounting
```

## Migration Files

### Structure
- Location: `database/migrations/`
- Naming: `001_description.sql`, `002_another.sql`
- Execution: Sequential by filename

### Rollback Support
Migrations can include rollback sections:

```sql
-- UP - Migration
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL
);

-- DOWN - Rollback
DROP TABLE users;
```

## Seed Files

### Structure
- Location: `database/seeds/`
- Naming: `001_description_seed.sql`
- Execution: Sequential, continues on failure

### Example
```sql
-- Seed: sample user data
INSERT INTO users (name) 
SELECT * FROM (VALUES
    ('John Doe'),
    ('Jane Smith')
) AS v(name)
WHERE NOT EXISTS (SELECT 1 FROM users WHERE users.name = v.name);
```

## Key Features

### ✅ Shared Logic
- Both NestJS service and CLI use the same core migration logic
- Ensures consistency between development and production deployments

### ✅ Flexible Configuration
- CLI arguments override environment variables
- Custom paths for migrations and seeds
- Database connection parameters

### ✅ Production Ready
- Transaction safety for migrations
- Proper error handling and logging
- Connection management

### ✅ Developer Friendly
- Clear status reporting
- Verbose logging option
- Helpful error messages
- Comprehensive help system

## Examples

### Development Workflow
```bash
# Start database
npm run db:up

# Check status
npm run migrate:status

# Run migrations
npm run migrate:run

# Run seeds for development data
npm run migrate:seeds
```

### Production Deployment
```bash
# Run migrations on production database
npm run migrate run --host prod-db.company.com --database production

# Check what was executed
npm run migrate status --host prod-db.company.com --database production
```

### Rollback Scenario
```bash
# Rollback specific migration
npm run migrate rollback --migration 003_add_user_table.sql

# Check status after rollback
npm run migrate:status
```

## Integration with NestJS

The migration system automatically runs when the NestJS backend starts:

- **Development**: Migrations and seeds run automatically
- **Production**: Only runs when `RUN_MIGRATIONS=true`
- **Seeds**: Only run when `RUN_SEEDS=true`

Manual control is available through the service:
```typescript
@Injectable()
export class MyService {
  constructor(private migrationService: SqlMigrationService) {}

  async runMigrations() {
    await this.migrationService.runMigrationsManually();
  }

  async getStatus() {
    return this.migrationService.getMigrationStatus();
  }
}
```

## Security Considerations

- Database credentials via environment variables
- SQL injection protection through parameterized queries
- Transaction rollback on migration failures
- Proper connection cleanup

## Troubleshooting

### Common Issues

1. **Module not found errors**: Ensure `npm run build shared` is run first
2. **Database connection**: Check if database is running and credentials are correct
3. **Migration failures**: Check SQL syntax and database permissions
4. **Path issues**: Verify migration and seed directories exist

### Debugging

Use verbose mode for detailed logging:
```bash
npm run migrate status --verbose
```

Check database directly:
```sql
SELECT * FROM migrations ORDER BY id;
```
