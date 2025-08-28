import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    return this.health.check([
      // Database connectivity check
      () => this.db.pingCheck('database'),
      
      // Memory usage check (less than 300MB)
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
      
      // Disk storage check (less than 80% full)
      () => this.disk.checkStorage('storage', {
        path: '/',
        thresholdPercent: 0.8,
      }),
    ]);
  }

  @Get('ready')
  @HealthCheck()
  async readiness() {
    // Readiness check - only essential services
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }

  @Get('live')
  @HealthCheck()
  async liveness() {
    // Liveness check - basic application health
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 500 * 1024 * 1024),
    ]);
  }
}
