#!/usr/bin/env ts-node

import { DataSource } from 'typeorm';
import { join } from 'path';
import { MigrationCore } from '../dist/shared/src/lib/migration-core';
import * as fs from 'fs';

// CLI argument parsing
interface CLIArgs {
  command: 'run' | 'status' | 'rollback' | 'seeds' | 'help';
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  migrationsPath?: string;
  seedsPath?: string;
  migrationName?: string; // for rollback
  verbose?: boolean;
}

function parseArguments(): CLIArgs {
  const args = process.argv.slice(2);
  const parsed: CLIArgs = {
    command: 'help',
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case 'run':
      case 'status':
      case 'rollback':
      case 'seeds':
      case 'help':
        parsed.command = arg;
        break;
      case '--host':
      case '-h':
        parsed.host = nextArg;
        i++;
        break;
      case '--port':
      case '-p':
        parsed.port = parseInt(nextArg);
        i++;
        break;
      case '--username':
      case '-u':
        parsed.username = nextArg;
        i++;
        break;
      case '--password':
      case '-w':
        parsed.password = nextArg;
        i++;
        break;
      case '--database':
      case '-d':
        parsed.database = nextArg;
        i++;
        break;
      case '--migrations-path':
      case '-m':
        parsed.migrationsPath = nextArg;
        i++;
        break;
      case '--seeds-path':
      case '-s':
        parsed.seedsPath = nextArg;
        i++;
        break;
      case '--migration':
        parsed.migrationName = nextArg;
        i++;
        break;
      case '--verbose':
      case '-v':
        parsed.verbose = true;
        break;
    }
  }

  return parsed;
}

function showHelp(): void {
  console.log(`
🗄️  Migration CLI Tool

Usage: npm run migrate <command> [options]

Commands:
  run                    Run all pending migrations
  status                 Show migration status
  rollback               Rollback a specific migration
  seeds                  Run all seed files
  help                   Show this help message

Options:
  --host, -h             Database host (default: localhost)
  --port, -p             Database port (default: 5432)
  --username, -u         Database username (default: postgres)
  --password, -w         Database password (default: password)
  --database, -d         Database name (default: homeaccounting)
  --migrations-path, -m  Path to migrations directory
  --seeds-path, -s       Path to seeds directory
  --migration            Migration name (for rollback command)
  --verbose, -v          Enable verbose logging

Environment Variables:
  DB_HOST                Database host
  DB_PORT                Database port
  DB_USERNAME            Database username
  DB_PASSWORD            Database password
  DB_NAME                Database name

Examples:
  npm run migrate run
  npm run migrate status
  npm run migrate rollback --migration 001_create_accounts_table.sql
  npm run migrate seeds
  npm run migrate run --host prod.example.com --database myapp
  `);
}

function createDatabaseConfig(args: CLIArgs) {
  return {
    type: 'postgres' as const,
    host: args.host || process.env.DB_HOST || 'localhost',
    port: args.port || parseInt(process.env.DB_PORT || '5432'),
    username: args.username || process.env.DB_USERNAME || 'postgres',
    password: args.password || process.env.DB_PASSWORD || 'password',
    database: args.database || process.env.DB_NAME || 'homeaccounting',
    logging: args.verbose || process.env.NODE_ENV === 'development',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  };
}

function createLogger(verbose: boolean = false) {
  return {
    log: (message: string) => {
      console.log(`🔄 ${message}`);
    },
    error: (message: string, error?: any) => {
      console.error(`❌ ${message}`);
      if (verbose && error) {
        console.error(error);
      }
    },
    warn: (message: string, error?: any) => {
      console.warn(`⚠️  ${message}`);
      if (verbose && error) {
        console.warn(error);
      }
    },
  };
}

async function runCommand(args: CLIArgs): Promise<void> {
  if (args.command === 'help') {
    showHelp();
    return;
  }

  const dbConfig = createDatabaseConfig(args);
  const logger = createLogger(args.verbose);
  
  // Determine paths
  const migrationsPath = args.migrationsPath || join(process.cwd(), 'database', 'migrations');
  const seedsPath = args.seedsPath || join(process.cwd(), 'database', 'seeds');

  // Verify paths exist
  if (!fs.existsSync(migrationsPath)) {
    logger.error(`Migrations path does not exist: ${migrationsPath}`);
    process.exit(1);
  }

  logger.log(`Connecting to database: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
  
  // Create data source
  const dataSource = new DataSource(dbConfig);
  
  try {
    // Initialize connection
    await dataSource.initialize();
    logger.log('Database connection established');

    // Create migration core
    const migrationCore = new MigrationCore({
      dataSource,
      migrationsPath,
      seedsPath,
      logger,
    });

    // Execute command
    switch (args.command) {
      case 'run':
        await migrationCore.runMigrations();
        break;
        
      case 'status':
        const status = await migrationCore.getMigrationStatus();
        console.log('\n📊 Migration Status:');
        console.log(`   Total migrations: ${status.allMigrations.length}`);
        console.log(`   Executed: ${status.executedMigrations.length}`);
        console.log(`   Pending: ${status.pendingMigrations.length}\n`);
        
        if (status.executedMigrations.length > 0) {
          console.log('✅ Executed migrations:');
          status.executedMigrations.forEach(migration => {
            console.log(`   • ${migration}`);
          });
          console.log('');
        }
        
        if (status.pendingMigrations.length > 0) {
          console.log('⏳ Pending migrations:');
          status.pendingMigrations.forEach(migration => {
            console.log(`   • ${migration}`);
          });
          console.log('');
        }
        break;
        
      case 'rollback':
        if (!args.migrationName) {
          logger.error('Migration name required for rollback. Use --migration <name>');
          process.exit(1);
        }
        await migrationCore.rollbackMigration(args.migrationName);
        break;
        
      case 'seeds':
        await migrationCore.runSeeds();
        break;
        
      default:
        logger.error(`Unknown command: ${args.command}`);
        showHelp();
        process.exit(1);
    }

    logger.log('Operation completed successfully');
    
  } catch (error) {
    logger.error('Operation failed:', error);
    process.exit(1);
  } finally {
    // Close connection
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      logger.log('Database connection closed');
    }
  }
}

// Main execution
async function main(): Promise<void> {
  try {
    const args = parseArguments();
    await runCommand(args);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Only run main if this file is executed directly
if (require.main === module) {
  main();
}
