import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from '@shared/entities';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  async findAll(): Promise<Expense[]> {
    return this.expenseRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['account'],
    });
  }

  async findOne(id: string): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({ 
      where: { id },
      relations: ['account'],
    });
    
    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
    
    return expense;
  }

  async create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    const expense = this.expenseRepository.create({
      ...createExpenseDto,
      // Convert amount to string as expected by the entity
      amount: createExpenseDto.amount.toString(),
      expenseDate: createExpenseDto.expenseDate || new Date().toISOString().split('T')[0],
      paymentMethod: createExpenseDto.paymentMethod || 'cash',
      isRecurring: createExpenseDto.isRecurring ?? false,
      isActive: createExpenseDto.isActive ?? true,
    });
    
    return this.expenseRepository.save(expense);
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto): Promise<Expense> {
    const expense = await this.findOne(id); // This will throw if not found
    
    // Prepare update data - convert amount to string if provided
    const updateData: any = { ...updateExpenseDto };
    if ('amount' in updateExpenseDto && updateExpenseDto.amount !== undefined) {
      updateData.amount = updateExpenseDto.amount.toString();
    }
    
    // Merge the updates
    const updatedExpense = this.expenseRepository.merge(expense, updateData);
    return this.expenseRepository.save(updatedExpense);
  }

  async remove(id: string): Promise<void> {
    const expense = await this.findOne(id); // This will throw if not found
    await this.expenseRepository.remove(expense);
  }

  // Business methods for filtering and searching
  async findByCategory(category: string): Promise<Expense[]> {
    return this.expenseRepository.find({
      where: { category },
      order: { createdAt: 'DESC' },
      relations: ['account'],
    });
  }

  async findByAccount(accountId: string): Promise<Expense[]> {
    return this.expenseRepository.find({
      where: { accountId },
      order: { createdAt: 'DESC' },
      relations: ['account'],
    });
  }

  async findByDateRange(startDate: string, endDate: string): Promise<Expense[]> {
    return this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.account', 'account')
      .where('expense.expenseDate >= :startDate', { startDate })
      .andWhere('expense.expenseDate <= :endDate', { endDate })
      .orderBy('expense.expenseDate', 'DESC')
      .getMany();
  }

  async findByStatus(isActive: boolean): Promise<Expense[]> {
    return this.expenseRepository.find({
      where: { isActive },
      order: { createdAt: 'DESC' },
      relations: ['account'],
    });
  }

  async findRecurring(): Promise<Expense[]> {
    return this.expenseRepository.find({
      where: { isRecurring: true, isActive: true },
      order: { createdAt: 'DESC' },
      relations: ['account'],
    });
  }

  async getTotalByCategory(): Promise<{ category: string; total: number }[]> {
    const result = await this.expenseRepository
      .createQueryBuilder('expense')
      .select('expense.category', 'category')
      .addSelect('SUM(CAST(expense.amount AS DECIMAL))', 'total')
      .where('expense.isActive = true')
      .groupBy('expense.category')
      .orderBy('total', 'DESC')
      .getRawMany();

    return result.map(item => ({
      category: item.category,
      total: parseFloat(item.total) || 0,
    }));
  }
}
