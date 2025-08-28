# ✅ Entity Implementation Checklist

Quick reference checklist for implementing new entities in the Home Accounting project.

## 🚀 Quick Start Commands

```bash
# 1. Create migration
npm run migration:create create_[entity_name]_table

# 2. Start database (if not running)
npm run db:up

# 3. Run migrations
npm run start:backend  # Start, wait for migrations, then stop

# 4. Generate entities
npm run entities:generate
```

## 📋 Implementation Checklist

### Database Layer
- [ ] **Migration created** with proper table structure
  - [ ] UUID primary key with `uuid_generate_v4()`
  - [ ] Proper column types and constraints
  - [ ] Foreign key relationships
  - [ ] Indexes for performance
  - [ ] `created_at` and `updated_at` timestamps
- [ ] **Seed data added** with realistic test data
- [ ] **Migration executed** successfully
- [ ] **Entity generated** using `npm run entities:generate`

### Backend Layer
- [ ] **Service created** in `backend/src/app/[entity-name]/`
  - [ ] CRUD operations (create, read, update, delete)
  - [ ] Proper error handling
  - [ ] Input validation
  - [ ] Business logic encapsulation
- [ ] **Controller created** with REST endpoints
  - [ ] `GET /[entity-name]` - List all
  - [ ] `GET /[entity-name]/:id` - Get by ID
  - [ ] `POST /[entity-name]` - Create new
  - [ ] `PUT /[entity-name]/:id` - Update existing
  - [ ] `DELETE /[entity-name]/:id` - Delete by ID
- [ ] **Module created** and imported in `app.module.ts`
- [ ] **DTOs defined** for create and update operations

### Frontend Layer
- [ ] **Page component created** in `frontend/src/app/[entity-name]/`
  - [ ] List view with data fetching
  - [ ] Loading and error states
  - [ ] Basic CRUD operations UI
- [ ] **CSS module created** with responsive styling
- [ ] **Route configured** in main app router
- [ ] **Navigation link added** (if needed)
- [ ] **Form components created** for create/edit operations

### Shared Types
- [ ] **Entity imported** from `@shared/entities`
- [ ] **Types used consistently** across frontend and backend
- [ ] **Shared interfaces defined** for API responses
- [ ] **Enums exported** if used in entity

### Quality Assurance
- [ ] **API endpoints tested** with curl or Postman
- [ ] **Frontend page loads** without errors
- [ ] **CRUD operations work** end-to-end
- [ ] **Error handling tested** (invalid data, network errors)
- [ ] **TypeScript compilation** passes without errors
- [ ] **Console warnings checked** and resolved

## 🎯 File Structure Template

```
backend/src/app/[entity-name]/
├── [entity-name].controller.ts    # REST endpoints
├── [entity-name].service.ts       # Business logic
├── [entity-name].module.ts        # NestJS module
└── dto/
    ├── create-[entity-name].dto.ts
    └── update-[entity-name].dto.ts

frontend/src/app/[entity-name]/
├── [EntityName].tsx               # Main page component
├── [EntityName].module.css        # Component styles
└── components/
    ├── [EntityName]List.tsx       # List component
    ├── [EntityName]Form.tsx       # Form component
    └── [EntityName]Detail.tsx     # Detail view component

shared/src/entities/
├── [entity-name].entity.ts        # TypeORM entity (auto-generated)
└── index.ts                       # Export declarations (auto-updated)

database/
├── migrations/
│   └── XXX_create_[entity_name]_table.sql
└── seeds/
    └── XXX_create_[entity_name]_table_seed.sql
```

## 🔧 Common Patterns

### Entity Naming Conventions
- **Database table**: `snake_case` (e.g., `transaction_categories`)
- **TypeORM entity**: `PascalCase` (e.g., `TransactionCategory`)
- **Properties**: `camelCase` (e.g., `categoryType`)
- **Files**: `kebab-case` (e.g., `transaction-categories.service.ts`)

### Required Columns
```sql
-- Always include these in migrations
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
```

### TypeORM Decorators
```typescript
@Entity('[table_name]')
export class EntityName {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### Controller Template
```typescript
@Controller('[entity-name]')
export class EntityController {
  constructor(private readonly service: EntityService) {}

  @Get()
  async findAll(): Promise<Entity[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Entity> {
    return this.service.findOne(id);
  }

  @Post()
  async create(@Body() data: CreateEntityDto): Promise<Entity> {
    return this.service.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateEntityDto): Promise<Entity> {
    return this.service.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
```

## 🚨 Common Pitfalls

- [ ] **Forgetting to run migrations** before generating entities
- [ ] **Not updating app.module.ts** to import new modules
- [ ] **Inconsistent naming** between database, entity, and files
- [ ] **Missing error handling** in API calls
- [ ] **Not adding proper indexes** for foreign keys
- [ ] **Forgetting to add routes** for new pages
- [ ] **Using incorrect TypeScript types** from shared entities
- [ ] **Not testing CRUD operations** end-to-end

## 🎨 UI/UX Best Practices

- [ ] **Loading states** for async operations
- [ ] **Error messages** user-friendly and actionable
- [ ] **Form validation** with clear feedback
- [ ] **Responsive design** works on mobile
- [ ] **Confirmation dialogs** for destructive actions
- [ ] **Empty states** when no data exists
- [ ] **Proper accessibility** attributes

## 🧪 Testing Commands

```bash
# Test database connection
npm run db:up

# Test backend API
curl http://localhost:3000/api/[entity-name]

# Test frontend page
open http://localhost:4200/[entity-name]

# Run all tests
npm run test

# Check types
npm run lint
```

## ⚡ Pro Tips

- **Use the example**: Follow `ENTITY_WORKFLOW_EXAMPLE.md` for detailed implementation
- **Copy patterns**: Look at existing entities for consistent patterns
- **Test incrementally**: Test each layer before moving to the next
- **Use TypeScript**: Let the compiler catch errors early
- **Check logs**: Monitor backend logs for database/API errors
- **Review generated entities**: Ensure relationships are correct
- **Backup first**: Generated entities will overwrite existing files
