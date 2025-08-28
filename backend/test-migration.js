const { DataSource } = require('typeorm');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'homeaccounting',
  entities: [path.join(__dirname, 'dist/entities/*.entity.js')],
  migrations: [path.join(__dirname, 'dist/migrations/*{.ts,.js}')],
  synchronize: false,
  logging: true,
});

async function testConnection() {
  try {
    console.log('🔄 Initializing database connection...');
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully!');

    console.log('🔄 Checking pending migrations...');
    const pendingMigrations = await AppDataSource.showMigrations();
    console.log(`📊 Pending migrations: ${pendingMigrations}`);

    console.log('🔄 Running migrations...');
    await AppDataSource.runMigrations();
    console.log('✅ Migrations completed successfully!');

    console.log('🔄 Verifying accounts table...');
    const result = await AppDataSource.query('SELECT COUNT(*) as count FROM accounts');
    console.log(`📊 Accounts table has ${result[0].count} records`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🔌 Database connection closed');
    }
  }
}

// Set environment variables and run test
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_USERNAME = 'postgres';
process.env.DB_PASSWORD = 'password';
process.env.DB_NAME = 'homeaccounting';
process.env.NODE_ENV = 'development';

testConnection();
