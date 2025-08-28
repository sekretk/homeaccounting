# 📚 Home Accounting Project Documentation

Comprehensive documentation for the Home Accounting project development workflow.

## 🎯 Quick Start for New Entities

When adding new entities to the system, follow this **5-step workflow**:

1. **📝 Create Migration** - `npm run migration:create create_[entity_name]_table`
2. **🌱 Add Seeds** - Edit the generated seed file with sample data
3. **🗄️ Run Database & Generate Entity** - `npm run entities:generate`
4. **🎛️ Create Backend Controller** - Full CRUD REST API
5. **🖼️ Create Frontend Page** - React components with shared types

## 📁 Documentation Files

| File/Directory | Purpose | Usage |
|------|---------|-------|
| `.cursor/rules/` | **Cursor IDE Rules (Hierarchical)** | Context-aware guidance in Cursor |
| `ENTITY_WORKFLOW_EXAMPLE.md` | **Complete Example** | Step-by-step TransactionCategory implementation |
| `ENTITY_CHECKLIST.md` | **Quick Reference** | Checklist for entity implementation |

## 🏗️ File Structure

```
docs/
├── README.md                    # This overview file
├── ENTITY_WORKFLOW_EXAMPLE.md   # Complete implementation example
└── ENTITY_CHECKLIST.md         # Quick reference checklist

.cursor/
└── rules/                       # Cursor IDE project rules (hierarchical)
    ├── entity-workflow.mdc      # Main 5-step entity workflow
    └── coding-standards.mdc     # General coding standards

backend/.cursor/
└── rules/
    └── nestjs-patterns.mdc      # Backend-specific NestJS patterns

frontend/.cursor/
└── rules/
    └── react-patterns.mdc       # Frontend-specific React patterns

scripts/
├── create-migration.ts          # TypeScript migration creator
├── generate-entities.sh         # External package wrapper
├── init-db.sql                 # Database initialization
└── README.md                   # Scripts documentation
```

## 🔄 Development Workflow Overview

### Database First Approach
1. **Design Schema** → Write migration SQL
2. **Add Sample Data** → Create realistic seeds
3. **Run Migrations** → Execute database changes
4. **Generate Entities** → Auto-create TypeORM classes

### Full Stack Development
4. **Backend Layer** → Service + Controller + Module
5. **Frontend Layer** → Components + Pages + Routing
6. **Integration** → End-to-end testing

## 🛠️ Key Technologies

- **Database**: PostgreSQL with UUID primary keys
- **Backend**: NestJS + TypeORM + TypeScript
- **Frontend**: React + TypeScript + CSS Modules
- **Shared**: TypeScript entities across frontend/backend
- **Tools**: External packages (typeorm-model-generator)
- **IDE**: Cursor with custom project rules

## 🎯 Code Standards

### Naming Conventions
- **Database**: `snake_case` (transaction_categories)
- **Entities**: `PascalCase` (TransactionCategory)
- **Properties**: `camelCase` (categoryType)
- **Files**: `kebab-case` (transaction-categories.service.ts)

### Required Patterns
- UUID primary keys with `uuid_generate_v4()`
- `created_at` and `updated_at` timestamps
- Proper TypeORM decorators
- REST API conventions (GET, POST, PUT, DELETE)
- Shared types across frontend/backend

## 🚀 Benefits

### Professional Quality
- ✅ **External Packages**: Battle-tested tools instead of custom scripts
- ✅ **Type Safety**: Full TypeScript throughout the stack
- ✅ **Consistency**: Enforced patterns via Cursor rules
- ✅ **Documentation**: Comprehensive guides and examples

### Developer Experience
- ✅ **Quick Start**: 5-step workflow for new entities
- ✅ **IDE Integration**: Cursor rules provide automatic guidance
- ✅ **Error Prevention**: TypeScript catches issues at compile time
- ✅ **Backup Safety**: Smart backup system for generated entities

### Maintainability
- ✅ **Zero Custom Scripts**: No maintenance of database introspection code
- ✅ **Clear Structure**: Consistent file organization
- ✅ **Best Practices**: Industry-standard patterns and tools
- ✅ **Testing Ready**: Built-in support for unit and integration tests

## 🧪 Quick Commands

```bash
# Create new entity (complete workflow)
npm run migration:create create_my_entity_table  # 1. Migration
# Edit migration and seed files                  # 2. Seeds
npm run db:up && npm run start:backend          # 3. Run migrations
npm run entities:generate                        # 4. Generate entities
# Create backend service/controller              # 5. Backend
# Create frontend components                     # 6. Frontend

# Development helpers
npm run db:up          # Start PostgreSQL
npm run start:all      # Start both frontend and backend
npm run test           # Run all tests
npm run lint           # Check code quality
```

## 📞 Need Help?

1. **Check Examples**: `ENTITY_WORKFLOW_EXAMPLE.md` has complete TransactionCategory implementation
2. **Use Checklist**: `ENTITY_CHECKLIST.md` for quick validation
3. **Follow Cursor**: `.cursor/rules` provides step-by-step guidance
4. **Review Scripts**: `scripts/README.md` explains all available tools

---

**Ready to add your first entity?** Start with `npm run migration:create create_[your_entity]_table` and follow the 5-step workflow! 🚀
