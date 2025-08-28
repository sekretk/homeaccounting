# Scripts Documentation

TypeScript utility scripts for database management and code generation.

## 📁 Available Scripts

### 🆕 `create-migration.ts`
Creates SQL migration and seed files with proper numbering.

```bash
# Usage
npm run migration:create my_migration_name

# Direct usage
ts-node scripts/create-migration.ts my_migration_name
```

**Features:**
- ✅ Auto-incremental numbering (001, 002, etc.)
- ✅ Creates both migration and seed files
- ✅ Template with examples and best practices
- ✅ Automatic directory creation

### 🔄 `generate-entities.sh`
Generates TypeORM entities using `typeorm-model-generator` package with CLI parameters.

```bash
# Usage with default parameters (recommended)
npm run entities:generate

# Custom parameters via script arguments
npm run entities:generate:custom -- -db myapp -h remote.db.com -u admin -w secret123

# Direct script usage with parameters
./scripts/generate-entities.sh -db homeaccounting -h localhost -p 5432 -u postgres -w password
```

**CLI Options:**
- `-db, --database`: Database name
- `-h, --host`: Database host  
- `-p, --port`: Database port
- `-u, --user`: Database username
- `-w, --password`: Database password
- `-o, --output`: Output directory

**Default Configuration:**
The main npm script uses these default parameters:
```bash
-db homeaccounting -h localhost -p 5432 -u postgres -w password
```

To use different settings, modify the parameters in `package.json` or use the `:custom` variant.

**Features:**
- ✅ **Professional Package**: Uses `typeorm-model-generator` (battle-tested)
- ✅ **Full TypeScript Support**: Complete type definitions and decorators
- ✅ **Smart Backup**: Automatically backs up existing entities before regeneration
- ✅ **Connection Testing**: Validates database connection before generation
- ✅ **Comprehensive Configuration**: Optimal settings for PostgreSQL + TypeORM
- ✅ **Index Generation**: Creates index.ts for easy imports
- ✅ **Constructor Support**: Generates constructors for partial initialization
- ✅ **Strict Mode**: Marks optional fields with proper TypeScript syntax

### 📄 `init-db.sql`
Database initialization script with UUID extension.

## 🛠️ Modern Improvements

**From Custom Script to Professional Package:**
- ✅ **Reliability**: Uses battle-tested `typeorm-model-generator` package
- ✅ **Feature-Rich**: Support for relationships, indexes, enums, and complex scenarios
- ✅ **Maintained**: Regular updates and bug fixes from the community
- ✅ **Type Safety**: Full TypeScript support with modern syntax
- ✅ **Error Handling**: Robust error handling and connection validation
- ✅ **Backup System**: Safe regeneration with automatic backups
- ✅ **Flexibility**: Environment variable configuration

## 🔧 Dependencies

Required dependencies (already installed):
- `ts-node`: TypeScript execution environment
- `typeorm-model-generator`: Professional entity generator package
- `@types/node`: Node.js type definitions  
- `typescript`: TypeScript compiler
- `pg`: PostgreSQL client (for connection testing)

## 📋 Usage Examples

### Creating a Migration
```bash
# Create a new migration for user accounts
npm run migration:create create_user_accounts_table

# Creates:
# - database/migrations/002_create_user_accounts_table.sql
# - database/seeds/002_create_user_accounts_table_seed.sql
```

### Generating Entities
```bash
# Ensure your database is running
npm run db:up

# Generate entities with default parameters
npm run entities:generate

# Generate entities with custom database settings
npm run entities:generate:custom -- -db myapp -h remote.db.com -u admin -w secret123

# Or edit the default parameters in package.json:
# "entities:generate": "./scripts/generate-entities.sh -db myapp -h myhost ..."

# Generated files appear in:
# - shared/src/entities/account.entity.ts
# - shared/src/entities/expense.entity.ts
# - shared/src/entities/index.ts (auto-generated)
# - Backup: shared/src/entities.backup.YYYYMMDD_HHMMSS/
```

## 🔍 Script Configuration

### Database Connection Parameters
The `generate-entities.sh` script accepts CLI parameters with these defaults:

```bash
# Default values (can be overridden via CLI arguments)
DB_HOST="localhost"
DB_PORT="5432"
DB_USER="postgres"
DB_PASS="password"
DB_NAME="homeaccounting"
OUTPUT_DIR="shared/src/entities"
```

**To modify database settings:**
1. **Preferred**: Edit the npm script in `package.json`:
   ```json
   "entities:generate": "./scripts/generate-entities.sh -db myapp -h myhost -u myuser"
   ```
2. **Alternative**: Use the custom script with parameters:
   ```bash
   npm run entities:generate:custom -- -db myapp -h myhost -u myuser
   ```

### TypeScript Config
Scripts use project's `tsconfig.json` with:
- ES2020+ target
- Node.js module resolution
- Strict type checking
- Decorators support (for TypeORM)

## 🚀 Benefits of External Package

1. **Professional Quality**: Battle-tested package used by thousands of projects
2. **Feature Complete**: Supports relationships, indexes, enums, and complex database schemas
3. **Actively Maintained**: Regular updates, bug fixes, and new features from the community
4. **Zero Maintenance**: No need to maintain custom database introspection logic
5. **Better Error Handling**: Comprehensive error messages and connection validation
6. **Backup Safety**: Smart backup system prevents accidental data loss
7. **Configuration Flexibility**: Environment variable support for different environments
