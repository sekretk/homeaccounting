import { 
  IsString, 
  IsOptional, 
  IsBoolean, 
  IsUUID,
  IsNumber,
  IsDateString,
  IsArray,
  IsUrl,
  MaxLength,
  MinLength,
  Min,
  IsIn,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateExpenseDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Type(() => Number)
  amount: number;

  @IsOptional()
  @IsDateString()
  expenseDate?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  category: string;

  @IsOptional()
  @IsString()
  @IsIn(['cash', 'credit_card', 'debit_card', 'bank_transfer', 'check', 'mobile_payment', 'other'])
  paymentMethod?: string;

  @IsOptional()
  @IsUUID()
  accountId?: string;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => Array.isArray(value) ? value : [])
  tags?: string[];

  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  receiptUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

