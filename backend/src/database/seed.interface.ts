import { DataSource } from 'typeorm';

/**
 * Interface that all seed files must implement
 */
export interface SeedInterface {
  /**
   * Execute the seed operation
   * @param dataSource TypeORM DataSource instance
   */
  run(dataSource: DataSource): Promise<void>;
}
