import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from '../database/database.config';
import { SqlMigrationService } from '../database/sql-migration.service';
import { ExpenseModule } from './expense/expense.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(databaseConfig),
    ExpenseModule,
  ],
  controllers: [AppController],
  providers: [AppService, SqlMigrationService],
})
export class AppModule {}
