# 📋 Entity Workflow Example

Complete example of adding a new `TransactionCategory` entity to the system.

## 🎯 Example Scenario

Adding a `TransactionCategory` entity for managing expense and income categories.

## Step-by-Step Implementation

### 1. 📝 Create Migration

```bash
# Create the migration
npm run migration:create create_transaction_categories_table
```

**Edit `database/migrations/XXX_create_transaction_categories_table.sql`:**
```sql
-- Migration: create_transaction_categories_table
-- Created: 2025-08-22
-- Description: Create table for transaction categories

CREATE TABLE transaction_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#007bff', -- Hex color code
    icon VARCHAR(50) DEFAULT 'folder', -- Icon name
    category_type VARCHAR(20) NOT NULL CHECK (category_type IN ('income', 'expense')),
    parent_id UUID REFERENCES transaction_categories(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_transaction_categories_type ON transaction_categories(category_type);
CREATE INDEX IF NOT EXISTS idx_transaction_categories_parent_id ON transaction_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_transaction_categories_active ON transaction_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_transaction_categories_name ON transaction_categories(name);

-- Create unique constraint for name within type
CREATE UNIQUE INDEX IF NOT EXISTS idx_transaction_categories_name_type 
ON transaction_categories(name, category_type) WHERE parent_id IS NULL;
```

### 2. 🌱 Add Seeds

**Edit `database/seeds/XXX_create_transaction_categories_table_seed.sql`:**
```sql
-- Seed: transaction_categories sample data
-- Migration: XXX_create_transaction_categories_table.sql
-- Description: Sample categories for development and testing

INSERT INTO transaction_categories (name, description, color, icon, category_type) 
SELECT * FROM (VALUES
    ('Food & Dining', 'Restaurants, groceries, and food delivery', '#ff6b6b', 'restaurant', 'expense'),
    ('Transportation', 'Gas, public transport, rideshare, parking', '#4ecdc4', 'car', 'expense'),
    ('Shopping', 'Clothing, electronics, and personal items', '#45b7d1', 'shopping-bag', 'expense'),
    ('Entertainment', 'Movies, games, streaming services', '#96ceb4', 'film', 'expense'),
    ('Utilities', 'Electricity, water, internet, phone', '#feca57', 'zap', 'expense'),
    ('Healthcare', 'Medical expenses, insurance, pharmacy', '#ff9ff3', 'heart', 'expense'),
    ('Salary', 'Primary employment income', '#26de81', 'dollar-sign', 'income'),
    ('Freelance', 'Contract and freelance work', '#2bcbba', 'briefcase', 'income'),
    ('Investments', 'Dividends, capital gains', '#45aaf2', 'trending-up', 'income'),
    ('Business', 'Business-related income', '#a55eea', 'building', 'income')
) AS v(name, description, color, icon, category_type)
WHERE NOT EXISTS (SELECT 1 FROM transaction_categories WHERE transaction_categories.name = v.name);

-- Add subcategories for food & dining
WITH food_category AS (
    SELECT id FROM transaction_categories WHERE name = 'Food & Dining' AND category_type = 'expense'
)
INSERT INTO transaction_categories (name, description, color, icon, category_type, parent_id) 
SELECT * FROM (VALUES
    ('Restaurants', 'Dining out and takeaway', '#ff6b6b', 'utensils', 'expense'),
    ('Groceries', 'Supermarket and food shopping', '#ff6b6b', 'shopping-cart', 'expense'),
    ('Coffee & Snacks', 'Coffee shops and quick snacks', '#ff6b6b', 'coffee', 'expense')
) AS v(name, description, color, icon, category_type), food_category
WHERE NOT EXISTS (SELECT 1 FROM transaction_categories WHERE transaction_categories.name = v.name);
```

### 3. 🗄️ Run Database & Generate Entity

```bash
# Start database (if not running)
npm run db:up

# Start backend to run migrations
npm run start:backend
# Wait for migrations to complete, then stop (Ctrl+C)

# Generate entities from updated schema
npm run entities:generate
```

**Verify generated entity in `shared/src/entities/TransactionCategory.entity.ts`:**
```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

export enum CategoryType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

@Entity('transaction_categories')
export class TransactionCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'varchar', length: 7, default: '#007bff' })
  color?: string;

  @Column({ type: 'varchar', length: 50, default: 'folder' })
  icon?: string;

  @Column({ type: 'varchar', length: 20 })
  categoryType: CategoryType;

  @Column({ type: 'uuid', nullable: true })
  parentId?: string | null;

  @Column({ type: 'boolean', default: true })
  isActive?: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => TransactionCategory, category => category.children)
  @JoinColumn({ name: 'parent_id' })
  parent?: TransactionCategory;

  @OneToMany(() => TransactionCategory, category => category.parent)
  children?: TransactionCategory[];
}
```

### 4. 🎛️ Create Backend Controller

**Create `backend/src/app/transaction-categories/transaction-categories.service.ts`:**
```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionCategory, CategoryType } from '@shared/entities';

export interface CreateTransactionCategoryDto {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  categoryType: CategoryType;
  parentId?: string;
  isActive?: boolean;
}

@Injectable()
export class TransactionCategoriesService {
  constructor(
    @InjectRepository(TransactionCategory)
    private readonly categoryRepository: Repository<TransactionCategory>,
  ) {}

  async findAll(): Promise<TransactionCategory[]> {
    return this.categoryRepository.find({
      relations: ['parent', 'children'],
      order: { name: 'ASC' },
    });
  }

  async findByType(type: CategoryType): Promise<TransactionCategory[]> {
    return this.categoryRepository.find({
      where: { categoryType: type, isActive: true },
      relations: ['children'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<TransactionCategory> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });
    
    if (!category) {
      throw new Error(`Transaction category with ID ${id} not found`);
    }
    
    return category;
  }

  async create(data: CreateTransactionCategoryDto): Promise<TransactionCategory> {
    const category = this.categoryRepository.create(data);
    return this.categoryRepository.save(category);
  }

  async update(id: string, data: Partial<CreateTransactionCategoryDto>): Promise<TransactionCategory> {
    await this.categoryRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Transaction category with ID ${id} not found`);
    }
  }
}
```

**Create `backend/src/app/transaction-categories/transaction-categories.controller.ts`:**
```typescript
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { TransactionCategoriesService, CreateTransactionCategoryDto } from './transaction-categories.service';
import { TransactionCategory, CategoryType } from '@shared/entities';

@Controller('transaction-categories')
export class TransactionCategoriesController {
  constructor(private readonly categoriesService: TransactionCategoriesService) {}

  @Get()
  async findAll(@Query('type') type?: CategoryType): Promise<TransactionCategory[]> {
    if (type) {
      return this.categoriesService.findByType(type);
    }
    return this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TransactionCategory> {
    return this.categoriesService.findOne(id);
  }

  @Post()
  async create(@Body() data: CreateTransactionCategoryDto): Promise<TransactionCategory> {
    return this.categoriesService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<CreateTransactionCategoryDto>,
  ): Promise<TransactionCategory> {
    return this.categoriesService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.categoriesService.remove(id);
  }
}
```

**Create `backend/src/app/transaction-categories/transaction-categories.module.ts`:**
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionCategory } from '@shared/entities';
import { TransactionCategoriesController } from './transaction-categories.controller';
import { TransactionCategoriesService } from './transaction-categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionCategory])],
  controllers: [TransactionCategoriesController],
  providers: [TransactionCategoriesService],
  exports: [TransactionCategoriesService],
})
export class TransactionCategoriesModule {}
```

**Update `backend/src/app/app.module.ts`:**
```typescript
// Add to imports array
import { TransactionCategoriesModule } from './transaction-categories/transaction-categories.module';

@Module({
  imports: [
    // ... existing imports
    TransactionCategoriesModule,
  ],
  // ... rest of module
})
export class AppModule {}
```

### 5. 🖼️ Create Frontend Page

**Create `frontend/src/app/transaction-categories/TransactionCategories.tsx`:**
```typescript
import React, { useState, useEffect } from 'react';
import { TransactionCategory, CategoryType } from '@shared/entities';
import styles from './TransactionCategories.module.css';

interface TransactionCategoriesProps {}

export const TransactionCategories: React.FC<TransactionCategoriesProps> = () => {
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [selectedType, setSelectedType] = useState<CategoryType | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [selectedType]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const url = selectedType === 'all' 
        ? '/api/transaction-categories' 
        : `/api/transaction-categories?type=${selectedType}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const data = await response.json();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const response = await fetch(`/api/transaction-categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      await fetchCategories(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading categories...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Transaction Categories</h1>
        <button className={styles.addButton}>
          Add Category
        </button>
      </header>

      <div className={styles.filters}>
        <button 
          className={selectedType === 'all' ? styles.active : ''}
          onClick={() => setSelectedType('all')}
        >
          All
        </button>
        <button 
          className={selectedType === CategoryType.INCOME ? styles.active : ''}
          onClick={() => setSelectedType(CategoryType.INCOME)}
        >
          Income
        </button>
        <button 
          className={selectedType === CategoryType.EXPENSE ? styles.active : ''}
          onClick={() => setSelectedType(CategoryType.EXPENSE)}
        >
          Expense
        </button>
      </div>

      <div className={styles.categoriesList}>
        {categories.map((category) => (
          <div key={category.id} className={styles.categoryCard}>
            <div className={styles.categoryIcon} style={{ color: category.color }}>
              <i className={`icon-${category.icon}`} />
            </div>
            <div className={styles.categoryInfo}>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <span className={styles.categoryType}>
                {category.categoryType}
              </span>
            </div>
            <div className={styles.categoryActions}>
              <button className={styles.editButton}>
                Edit
              </button>
              <button 
                className={styles.deleteButton}
                onClick={() => handleDelete(category.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className={styles.emptyState}>
          No categories found. Create your first category!
        </div>
      )}
    </div>
  );
};
```

**Create `frontend/src/app/transaction-categories/TransactionCategories.module.css`:**
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  margin: 0;
  color: #333;
}

.addButton {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.addButton:hover {
  background: #0056b3;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filters button {
  padding: 0.5rem 1rem;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.filters button:hover,
.filters button.active {
  border-color: #007bff;
  background: #007bff;
  color: white;
}

.categoriesList {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.categoryCard {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: box-shadow 0.2s;
}

.categoryCard:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.categoryIcon {
  font-size: 2rem;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 123, 255, 0.1);
  border-radius: 50%;
}

.categoryInfo {
  flex: 1;
}

.categoryInfo h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.categoryInfo p {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

.categoryType {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: #f8f9fa;
  color: #495057;
  border-radius: 4px;
  font-size: 0.8rem;
  text-transform: capitalize;
}

.categoryActions {
  display: flex;
  gap: 0.5rem;
}

.editButton, .deleteButton {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.editButton {
  background: #28a745;
  color: white;
}

.editButton:hover {
  background: #218838;
}

.deleteButton {
  background: #dc3545;
  color: white;
}

.deleteButton:hover {
  background: #c82333;
}

.loading, .error, .emptyState {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.error {
  color: #dc3545;
}
```

**Update `frontend/src/app/app.tsx` to include routing:**
```typescript
import { TransactionCategories } from './transaction-categories/TransactionCategories';

// Add route for transaction categories
<Route path="/categories" element={<TransactionCategories />} />
```

## 🧪 Testing the Implementation

```bash
# Start the full stack
npm run start:all

# Test the API endpoints
curl http://localhost:3000/api/transaction-categories
curl http://localhost:3000/api/transaction-categories?type=expense

# Visit the frontend
open http://localhost:4200/categories
```

## ✅ Verification Checklist

- [ ] Migration created and executed successfully
- [ ] Seed data populated in database
- [ ] Entity generated with proper types
- [ ] Backend service with CRUD operations
- [ ] Backend controller with REST endpoints
- [ ] Frontend page with list and basic operations
- [ ] Shared types used consistently
- [ ] Error handling implemented
- [ ] Styling applied and responsive
- [ ] Routes configured and working

This completes a full-stack entity implementation following the established workflow!
