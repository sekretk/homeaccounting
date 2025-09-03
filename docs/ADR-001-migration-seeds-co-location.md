# ADR-001: Co-locate Database Seeds with Migrations

## Status

**Accepted** - January 2, 2025

## Context

Previously, our database migrations and seed files were stored in separate directories:
- Migrations: `database/migrations/`  
- Seeds: `database/seeds/`

This separation caused several issues:
1. **Poor organization**: Related migration and seed files were physically separated
2. **Naming inconsistency**: Seed files used `_seed.sql` suffix while migrations used clean names
3. **Manual coordination**: Developers had to manually ensure seed files corresponded to migrations
4. **Complex tooling**: Migration scripts needed to manage two separate directories

## Decision

We will **co-locate database seed files with their corresponding migrations** using the following structure:

### File Naming Convention
- **Migrations**: `XXX_migration_name.sql` (unchanged)
- **Seeds**: `XXX_migration_name.seeds.sql` (new format)

### Directory Structure
```
database/
├── migrations/
│   ├── 001_create_accounts_table.sql
│   ├── 001_create_accounts_table.seeds.sql
│   ├── 002_create_expenses_table.sql  
│   ├── 002_create_expenses_table.seeds.sql
│   └── ...
```

### Migration Script Updates
- Remove `--seeds-path` parameter (no longer needed)
- Add `--apply-seeds` flag to `run` command for automatic seed application
- `seeds` command now looks for `*.seeds.sql` files in the migrations directory
- Seeds are matched to migrations by filename prefix (e.g., `001_*`)

## Consequences

### Positive
✅ **Better Organization**: Related migration and seed files are co-located  
✅ **Clear Naming**: `.seeds.sql` extension clearly indicates purpose and file type
✅ **SQL Tooling**: Editors provide syntax highlighting, linting, and autocomplete for seed files
✅ **Automatic Matching**: Tooling automatically pairs migrations with seeds  
✅ **Simplified Paths**: Only need to specify migrations directory  
✅ **Atomic Operations**: Can apply migrations + seeds in one command  
✅ **Version Control**: Migration and seed changes tracked together  

### Negative
❌ **Migration Required**: Existing seed files need to be moved and renamed  
❌ **Tooling Updates**: Scripts and CI/CD need updates  
❌ **Documentation**: Team needs to learn new conventions  

### Neutral
🔄 **Backward Compatibility**: Old `database/seeds/` directory will be removed  
🔄 **File Count**: Same number of files, just organized differently  

## Implementation Steps

1. ✅ Move existing seed files to migrations directory
2. ✅ Rename seed files with `.seeds.sql` extension  
3. ✅ Update migration script to support new structure
4. ✅ Add `--apply-seeds` flag functionality
5. 🔄 Update CI/CD pipelines to use new commands
6. 🔄 Remove old `database/seeds/` directory
7. 🔄 Update team documentation

## Usage Examples

### Apply migrations only
```bash
npm run migrate run
```

### Apply migrations and seeds together
```bash
npm run migrate run --apply-seeds
```

### Apply seeds only (for existing database)
```bash
npm run migrate seeds
```

### Check status (shows both migrations and available seeds)
```bash
npm run migrate status
```

## Validation

The new structure will be validated by:
- ✅ Migration script correctly identifies seed files
- ✅ Seeds can be applied independently via `seeds` command  
- ✅ Seeds can be applied automatically with `--apply-seeds` flag
- ✅ CI/CD pipeline successfully runs migrations and seeds
- ✅ Team members can easily locate related migration/seed pairs

## References

- Related to Entity Workflow documentation (`docs/ENTITY_WORKFLOW_EXAMPLE.md`)
- Migration system documentation (`docs/MIGRATION_SYSTEM.md`) 
- Database initialization scripts (`scripts/migrate.ts`)

---

**Author**: Development Team  
**Reviewed**: Architecture Team  
**Date**: January 2, 2025
