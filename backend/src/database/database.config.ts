import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { Account, Expense } from '@shared/entities';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || process.env.DB_PORT || '5432'),
  username: process.env.DATABASE_USER || process.env.DB_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || process.env.DB_NAME || 'homeaccounting',
  entities: [Account, Expense],
  synchronize: false, // Use SQL migrations instead of synchronize
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};
