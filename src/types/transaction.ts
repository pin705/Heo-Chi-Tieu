export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  walletId: string;
  date: number; // timestamp
  note?: string;
  createdAt: number; // timestamp
}

export interface TransactionFormData {
  amount: string;
  type: TransactionType;
  categoryId: string;
  walletId: string;
  date: Date;
  note: string;
}
