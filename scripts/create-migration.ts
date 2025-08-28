#!/usr/bin/env node

import { promises as fs } from 'fs';
import { join } from 'path';

interface MigrationConfig {
  name: string;
  number: string;
  date: string;
}

async function createMigration(): Promise<void> {
  // Get migration name from command line arguments
  const migrationName: string | undefined = process.argv[2];
  
  if (!migrationName) {
    console.error('❌ Please provide a migration name:');
    console.log('   npm run migration:create my_migration_name');
    process.exit(1);
  }

  try {
    // Create migrations directory if it doesn't exist
    const migrationsDir: string = join(process.cwd(), 'database', 'migrations');
    await fs.mkdir(migrationsDir, { recursive: true });

    // Create seeds directory if it doesn't exist
    const seedsDir: string = join(process.cwd(), 'database', 'seeds');
    await fs.mkdir(seedsDir, { recursive: true });

    // Get existing migration files to determine next number
    const files: string[] = await fs.readdir(migrationsDir);
    const migrationFiles: string[] = files.filter(f => f.endsWith('.sql')).sort();
    
    let nextNumber: string = '001';
    if (migrationFiles.length > 0) {
      const lastFile: string = migrationFiles[migrationFiles.length - 1];
      const lastNumber: number = parseInt(lastFile.substring(0, 3));
      nextNumber = String(lastNumber + 1).padStart(3, '0');
    }

    // Create configuration
    const config: MigrationConfig = {
      name: migrationName,
      number: nextNumber,
      date: new Date().toISOString().split('T')[0]
    };

    // Create file names
    const migrationFileName: string = `${config.number}_${config.name}.sql`;
    const seedFileName: string = `${config.number}_${config.name}_seed.sql`;
    
    const migrationFilePath: string = join(migrationsDir, migrationFileName);
    const seedFilePath: string = join(seedsDir, seedFileName);

    // Create migration template
    const migrationTemplate: string = `-- Migration: ${config.name}
-- Created: ${config.date}
-- Description: [Add your migration description here]

-- Add your SQL statements here
-- Example:
-- CREATE TABLE example (
--     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--     name VARCHAR(255) NOT NULL,
--     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE INDEX IF NOT EXISTS idx_example_name ON example(name);
`;

    // Create seed template
    const seedTemplate: string = `-- Seed: ${config.name} sample data
-- Migration: ${migrationFileName}
-- Description: [Add your seed description here]

-- Add your seed data here
-- Example:
-- INSERT INTO example (name) 
-- SELECT * FROM (VALUES
--     ('Sample 1'),
--     ('Sample 2')
-- ) AS v(name)
-- WHERE NOT EXISTS (SELECT 1 FROM example);
`;

    // Write files
    await fs.writeFile(migrationFilePath, migrationTemplate);
    await fs.writeFile(seedFilePath, seedTemplate);

    console.log('✅ Migration files created successfully:');
    console.log(`   📄 ${migrationFilePath}`);
    console.log(`   🌱 ${seedFilePath}`);
    console.log('');
    console.log('Next steps:');
    console.log('1. Edit the migration file to add your SQL statements');
    console.log('2. Edit the seed file to add sample data (optional)');
    console.log('3. Start your backend application to run the migration');

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error creating migration:', errorMessage);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  createMigration();
}
