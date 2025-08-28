import { DataSource } from 'typeorm';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

export interface MigrationConfig {
  dataSource: DataSource;
  migrationsPath: string;
  seedsPath: string;
  logger?: {
    log: (message: string) => void;
    error: (message: string, error?: any) => void;
    warn: (message: string, error?: any) => void;
  };
}

export interface MigrationRecord {
  id: number;
  name: string;
  executed_at: Date;
}

export interface MigrationStatus {
  executedMigrations: string[];
  pendingMigrations: string[];
  allMigrations: string[];
}

export class MigrationCore {
  private config: MigrationConfig;
  
  constructor(config: MigrationConfig) {
    this.config = config;
    
    // Default logger if none provided
    if (!this.config.logger) {
      this.config.logger = {
        log: (message: string) => console.log(`[MIGRATION] ${message}`),
        error: (message: string, error?: any) => console.error(`[MIGRATION ERROR] ${message}`, error),
        warn: (message: string, error?: any) => console.warn(`[MIGRATION WARN] ${message}`, error),
      };
    }
  }

  /**
   * Ensure migrations table exists
   */
  async ensureMigrationsTable(): Promise<void> {
    await this.config.dataSource.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  /**
   * Get list of executed migrations
   */
  async getExecutedMigrations(): Promise<string[]> {
    await this.ensureMigrationsTable();
    const result = await this.config.dataSource.query('SELECT name FROM migrations ORDER BY id');
    return result.map((row: MigrationRecord) => row.name);
  }

  /**
   * Get all migration files
   */
  async getAllMigrationFiles(): Promise<string[]> {
    try {
      const files = await readdir(this.config.migrationsPath);
      return files
        .filter(file => file.endsWith('.sql'))
        .sort();
    } catch (error) {
      this.config.logger?.warn('Migrations directory not found or empty');
      return [];
    }
  }

  /**
   * Get migration status
   */
  async getMigrationStatus(): Promise<MigrationStatus> {
    const allMigrations = await this.getAllMigrationFiles();
    const executedMigrations = await this.getExecutedMigrations();
    const pendingMigrations = allMigrations.filter(
      file => !executedMigrations.includes(file)
    );

    return {
      allMigrations,
      executedMigrations,
      pendingMigrations,
    };
  }

  /**
   * Execute a single migration
   */
  async executeMigration(fileName: string): Promise<void> {
    try {
      this.config.logger?.log(`Executing migration: ${fileName}`);
      
      const filePath = join(this.config.migrationsPath, fileName);
      const sql = await readFile(filePath, 'utf8');
      
      // Execute the migration in a transaction
      await this.config.dataSource.transaction(async (manager) => {
        // Split SQL file by semicolons and execute each statement
        const statements = sql
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        for (const statement of statements) {
          if (statement.trim()) {
            await manager.query(statement);
          }
        }

        // Mark migration as executed
        await manager.query(
          'INSERT INTO migrations (name) VALUES ($1)',
          [fileName]
        );
      });
      
      this.config.logger?.log(`✅ Migration completed: ${fileName}`);
    } catch (error) {
      this.config.logger?.error(`❌ Migration failed: ${fileName}`, error);
      throw error;
    }
  }

  /**
   * Run all pending migrations
   */
  async runMigrations(): Promise<void> {
    try {
      this.config.logger?.log('Starting SQL migrations...');
      
      const status = await this.getMigrationStatus();
      
      if (status.allMigrations.length === 0) {
        this.config.logger?.log('No migration files found');
        return;
      }

      if (status.pendingMigrations.length === 0) {
        this.config.logger?.log('No pending migrations found');
        return;
      }

      this.config.logger?.log(`Found ${status.pendingMigrations.length} pending migrations`);

      // Execute pending migrations
      for (const migrationFile of status.pendingMigrations) {
        await this.executeMigration(migrationFile);
      }

      this.config.logger?.log('All migrations completed successfully');
    } catch (error) {
      this.config.logger?.error('Error during migration process:', error);
      throw error;
    }
  }

  /**
   * Execute a single seed file
   */
  async executeSeed(fileName: string): Promise<void> {
    try {
      this.config.logger?.log(`Executing seed: ${fileName}`);
      
      const filePath = join(this.config.seedsPath, fileName);
      const sql = await readFile(filePath, 'utf8');
      
      // Split SQL file by semicolons and execute each statement
      const statements = sql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      for (const statement of statements) {
        if (statement.trim()) {
          await this.config.dataSource.query(statement);
        }
      }
      
      this.config.logger?.log(`✅ Seed completed: ${fileName}`);
    } catch (error) {
      this.config.logger?.warn(`⚠️ Seed failed (continuing): ${fileName}`, error instanceof Error ? error.message : String(error));
      // Continue with other seeds even if one fails
    }
  }

  /**
   * Run all seed files
   */
  async runSeeds(): Promise<void> {
    try {
      this.config.logger?.log('Starting seed execution...');
      
      // Get all seed files
      let files: string[];
      try {
        files = await readdir(this.config.seedsPath);
      } catch (error) {
        this.config.logger?.log('Seeds directory not found or empty');
        return;
      }
      
      const seedFiles = files
        .filter(file => file.endsWith('.sql'))
        .sort();

      if (seedFiles.length === 0) {
        this.config.logger?.log('No seed files found');
        return;
      }

      this.config.logger?.log(`Found ${seedFiles.length} seed files`);

      // Execute seed files
      for (const seedFile of seedFiles) {
        await this.executeSeed(seedFile);
      }

      this.config.logger?.log('All seeds completed successfully');
    } catch (error) {
      this.config.logger?.error('Error during seed process:', error);
      // Don't throw error for seeds - they're optional
    }
  }

  /**
   * Rollback a specific migration (if the file contains DOWN section)
   */
  async rollbackMigration(fileName: string): Promise<void> {
    try {
      this.config.logger?.log(`Rolling back migration: ${fileName}`);
      
      const filePath = join(this.config.migrationsPath, fileName);
      const sql = await readFile(filePath, 'utf8');
      
      // Look for DOWN section in SQL file
      const downMatch = sql.match(/--\s*DOWN\s*\n([\s\S]*?)(?=--\s*UP|\s*$)/i);
      if (!downMatch) {
        throw new Error(`No DOWN section found in migration: ${fileName}`);
      }
      
      const downSql = downMatch[1].trim();
      if (!downSql) {
        throw new Error(`Empty DOWN section in migration: ${fileName}`);
      }

      // Execute rollback in transaction
      await this.config.dataSource.transaction(async (manager) => {
        const statements = downSql
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        for (const statement of statements) {
          if (statement.trim()) {
            await manager.query(statement);
          }
        }

        // Remove migration record
        await manager.query(
          'DELETE FROM migrations WHERE name = $1',
          [fileName]
        );
      });
      
      this.config.logger?.log(`✅ Migration rolled back: ${fileName}`);
    } catch (error) {
      this.config.logger?.error(`❌ Rollback failed: ${fileName}`, error);
      throw error;
    }
  }
}
