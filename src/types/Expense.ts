export type ExpenseStatus = "pending" | "approved" | "rejected";

export interface Expense {
  id: string;
  userId: string;
  userName: string;
  category: string;
  amount: number;
  currency: string;
  description: string;
  receiptUrl: string;
  status: ExpenseStatus;
  reimbursementEntity: string;
  projectCompanyName?: string;
  projectName?: string;
  createdAt: string;
  updatedAt: string;
}
