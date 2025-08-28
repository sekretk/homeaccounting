import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { join } from 'path';
import { MigrationCore, MigrationStatus } from '@shared';



@Injectable()
export class SqlMigrationService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SqlMigrationService.name);
  private readonly migrationCore: MigrationCore;

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    const migrationsPath = join(process.cwd(), 'database', 'migrations');
    const seedsPath = join(process.cwd(), 'database', 'seeds');
    
    this.migrationCore = new MigrationCore({
      dataSource: this.dataSource,
      migrationsPath,
      seedsPath,
      logger: {
        log: (message: string) => this.logger.log(message),
        error: (message: string, error?: any) => this.logger.error(message, error),
        warn: (message: string, error?: any) => this.logger.warn(message, error),
      },
    });
  }

  async onApplicationBootstrap() {
    // Only run in development or when explicitly enabled
    const shouldRunMigrations = process.env.NODE_ENV === 'development' || process.env.RUN_MIGRATIONS === 'true';
    const shouldRunSeeds = process.env.RUN_SEEDS === 'true' || 
                          (process.env.NODE_ENV === 'development' && process.env.RUN_SEEDS !== 'false');
    
    if (shouldRunMigrations) {
      await this.migrationCore.runMigrations();
    }
    
    if (shouldRunSeeds) {
      await this.migrationCore.runSeeds();
    }
  }



  /**
   * Manually run migrations (can be called from API endpoints if needed)
   */
  async runMigrationsManually(): Promise<void> {
    await this.migrationCore.runMigrations();
  }

  /**
   * Manually run seeds
   */
  async runSeedsManually(): Promise<void> {
    await this.migrationCore.runSeeds();
  }

  /**
   * Get migration status
   */
  async getMigrationStatus(): Promise<MigrationStatus> {
    return this.migrationCore.getMigrationStatus();
  }

  /**
   * Execute a specific migration
   */
  async executeMigration(fileName: string): Promise<void> {
    return this.migrationCore.executeMigration(fileName);
  }

  /**
   * Rollback a specific migration
   */
  async rollbackMigration(fileName: string): Promise<void> {
    return this.migrationCore.rollbackMigration(fileName);
  }
}
