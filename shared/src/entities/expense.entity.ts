import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Account } from "./account.entity";

@Index("idx_expenses_account_id", ["accountId"], {})
@Index("idx_expenses_amount", ["amount"], {})
@Index("idx_expenses_category", ["category"], {})
@Index("idx_expenses_created", ["createdAt"], {})
@Index("idx_expenses_expense_date", ["expenseDate"], {})
@Index("expenses_pkey", ["id"], { unique: true })
@Index("idx_expenses_active", ["isActive"], {})
@Index("idx_expenses_tags", ["tags"], {})
@Entity("expenses")
export class Expense {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id?: string;

  @Column("character varying", { name: "title", length: 255 })
  title?: string;

  @Column("text", { name: "description", nullable: true })
  description?: string | null;

  @Column("numeric", { name: "amount", precision: 10, scale: 2 })
  amount?: string;

  @Column("date", { name: "expense_date", default: () => "CURRENT_DATE" })
  expenseDate?: string;

  @Column("character varying", { name: "category", length: 100 })
  category?: string;

  @Column("character varying", {
    name: "payment_method",
    nullable: true,
    length: 50,
    default: () => "'cash'",
  })
  paymentMethod?: string | null;

  @Column("uuid", { name: "account_id", nullable: true })
  accountId?: string | null;

  @Column("boolean", { name: "is_recurring", default: () => "false" })
  isRecurring?: boolean;

  @Column("text", { name: "tags", nullable: true, array: true })
  tags?: string[] | null;

  @Column("character varying", {
    name: "receipt_url",
    nullable: true,
    length: 500,
  })
  receiptUrl?: string | null;

  @Column("boolean", { name: "is_active", default: () => "true" })
  isActive?: boolean;

  @Column("timestamp without time zone", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt?: Date;

  @Column("timestamp without time zone", {
    name: "updated_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt?: Date;

  @ManyToOne(() => Account, (account: Account) => account.expenses, {
    onDelete: "SET NULL",
    lazy: true,
  })
  @JoinColumn([{ name: "account_id", referencedColumnName: "id" }])
  account?: Promise<Account>;

  constructor(init?: Partial<Expense>) {
    Object.assign(this, init);
  }
}
