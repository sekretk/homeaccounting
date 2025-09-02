import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { Account, Expense } from '@shared/entities';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'homeaccounting',
  entities: [Account, Expense],
  synchronize: false, // Use SQL migrations instead of synchronize
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};
