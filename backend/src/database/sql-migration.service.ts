import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

interface MigrationRecord {
  id: number;
  name: string;
  executed_at: Date;
}

@Injectable()
export class SqlMigrationService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SqlMigrationService.name);
  private readonly migrationsPath = join(process.cwd(), 'database', 'migrations');
  private readonly seedsPath = join(process.cwd(), 'database', 'seeds');

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async onApplicationBootstrap() {
    // Only run in development or when explicitly enabled
    const shouldRunMigrations = process.env.NODE_ENV === 'development' || process.env.RUN_MIGRATIONS === 'true';
    const shouldRunSeeds = process.env.RUN_SEEDS === 'true' || 
                          (process.env.NODE_ENV === 'development' && process.env.RUN_SEEDS !== 'false');
    
    if (shouldRunMigrations) {
      await this.runMigrations();
    }
    
    if (shouldRunSeeds) {
      await this.runSeeds();
    }
  }

  private async ensureMigrationsTable(): Promise<void> {
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  private async getExecutedMigrations(): Promise<string[]> {
    await this.ensureMigrationsTable();
    const result = await this.dataSource.query('SELECT name FROM migrations ORDER BY id');
    return result.map((row: MigrationRecord) => row.name);
  }

  private async markMigrationAsExecuted(name: string): Promise<void> {
    await this.dataSource.query(
      'INSERT INTO migrations (name) VALUES ($1)',
      [name]
    );
  }

  private async runMigrations(): Promise<void> {
    try {
      this.logger.log('Starting SQL migrations...');
      
      // Get all migration files
      const files = await readdir(this.migrationsPath);
      const migrationFiles = files
        .filter(file => file.endsWith('.sql'))
        .sort();

      if (migrationFiles.length === 0) {
        this.logger.log('No migration files found');
        return;
      }

      // Get executed migrations
      const executedMigrations = await this.getExecutedMigrations();

      // Find pending migrations
      const pendingMigrations = migrationFiles.filter(
        file => !executedMigrations.includes(file)
      );

      if (pendingMigrations.length === 0) {
        this.logger.log('No pending migrations found');
        return;
      }

      this.logger.log(`Found ${pendingMigrations.length} pending migrations`);

      // Execute pending migrations
      for (const migrationFile of pendingMigrations) {
        await this.executeMigration(migrationFile);
      }

      this.logger.log('All migrations completed successfully');
    } catch (error) {
      this.logger.error('Error during migration process:', error);
      throw error;
    }
  }

  private async executeMigration(fileName: string): Promise<void> {
    try {
      this.logger.log(`Executing migration: ${fileName}`);
      
      const filePath = join(this.migrationsPath, fileName);
      const sql = await readFile(filePath, 'utf8');
      
      // Execute the migration in a transaction
      await this.dataSource.transaction(async (manager) => {
        await manager.query(sql);
        await manager.query(
          'INSERT INTO migrations (name) VALUES ($1)',
          [fileName]
        );
      });
      
      this.logger.log(`✅ Migration completed: ${fileName}`);
    } catch (error) {
      this.logger.error(`❌ Migration failed: ${fileName}`, error);
      throw error;
    }
  }

  private async runSeeds(): Promise<void> {
    try {
      this.logger.log('Starting seed execution...');
      
      // Get all seed files
      let files: string[];
      try {
        files = await readdir(this.seedsPath);
      } catch (error) {
        this.logger.log('Seeds directory not found or empty');
        return;
      }
      
      const seedFiles = files
        .filter(file => file.endsWith('.sql'))
        .sort();

      if (seedFiles.length === 0) {
        this.logger.log('No seed files found');
        return;
      }

      this.logger.log(`Found ${seedFiles.length} seed files`);

      // Execute seed files
      for (const seedFile of seedFiles) {
        await this.executeSeed(seedFile);
      }

      this.logger.log('All seeds completed successfully');
    } catch (error) {
      this.logger.error('Error during seed process:', error);
      // Don't throw error for seeds - they're optional
    }
  }

  private async executeSeed(fileName: string): Promise<void> {
    try {
      this.logger.log(`Executing seed: ${fileName}`);
      
      const filePath = join(this.seedsPath, fileName);
      const sql = await readFile(filePath, 'utf8');
      
      await this.dataSource.query(sql);
      
      this.logger.log(`✅ Seed completed: ${fileName}`);
    } catch (error) {
      this.logger.warn(`⚠️ Seed failed (continuing): ${fileName}`, error.message);
      // Continue with other seeds even if one fails
    }
  }

  /**
   * Manually run migrations (can be called from API endpoints if needed)
   */
  async runMigrationsManually(): Promise<void> {
    await this.runMigrations();
  }

  /**
   * Manually run seeds
   */
  async runSeedsManually(): Promise<void> {
    await this.runSeeds();
  }

  /**
   * Get migration status
   */
  async getMigrationStatus(): Promise<{
    executedMigrations: string[];
    pendingMigrations: string[];
  }> {
    const files = await readdir(this.migrationsPath);
    const allMigrations = files
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    const executedMigrations = await this.getExecutedMigrations();
    const pendingMigrations = allMigrations.filter(
      file => !executedMigrations.includes(file)
    );

    return {
      executedMigrations,
      pendingMigrations,
    };
  }
}
