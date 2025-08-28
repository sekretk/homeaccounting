import { Column, Entity, Index, OneToMany } from "typeorm";
import { Expense } from "./expense.entity";

@Index("idx_accounts_created_at", ["createdAt"], {})
@Index("accounts_pkey", ["id"], { unique: true })
@Index("idx_accounts_active", ["isActive"], {})
@Index("idx_accounts_type", ["type"], {})
@Entity("accounts")
export class Account {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id?: string;

  @Column("character varying", { name: "name", length: 100 })
  name?: string;

  @Column("character varying", {
    name: "type",
    length: 20,
    default: () => "'checking'",
  })
  type?: string;

  @Column("numeric", {
    name: "balance",
    precision: 10,
    scale: 2,
    default: () => "0",
  })
  balance?: string;

  @Column("character varying", {
    name: "currency",
    length: 3,
    default: () => "'USD'",
  })
  currency?: string;

  @Column("text", { name: "description", nullable: true })
  description?: string | null;

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

  @OneToMany(() => Expense, (expense) => expense.account, { lazy: true })
  expenses?: Promise<Expense[]>;

  constructor(init?: Partial<Account>) {
    Object.assign(this, init);
  }
}
