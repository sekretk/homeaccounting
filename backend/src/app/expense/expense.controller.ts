import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Expense } from 'shared';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get()
  async findAll(
    @Query('category') category?: string,
    @Query('accountId') accountId?: string,
    @Query('active') active?: string,
    @Query('recurring') recurring?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<Expense[]> {
    // Handle date range filtering
    if (startDate && endDate) {
      return this.expenseService.findByDateRange(startDate, endDate);
    }

    // Handle category filtering
    if (category) {
      return this.expenseService.findByCategory(category);
    }

    // Handle account filtering
    if (accountId) {
      return this.expenseService.findByAccount(accountId);
    }

    // Handle active/inactive filtering
    if (active !== undefined) {
      const isActive = active === 'true';
      return this.expenseService.findByStatus(isActive);
    }

    // Handle recurring expenses
    if (recurring === 'true') {
      return this.expenseService.findRecurring();
    }

    return this.expenseService.findAll();
  }

  @Get('categories/totals')
  async getCategoryTotals(): Promise<{ category: string; total: number }[]> {
    return this.expenseService.getTotalByCategory();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Expense> {
    return this.expenseService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createExpenseDto: CreateExpenseDto,
  ): Promise<Expense> {
    return this.expenseService.create(createExpenseDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    return this.expenseService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.expenseService.remove(id);
  }
}
