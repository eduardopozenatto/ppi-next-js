export type LoanStatus = "pending" | "active" | "overdue" | "returned" | "cancelled";

export interface LoanItem {
  inventoryItemId: string;
  inventoryItemName: string;
  quantity: number;
}

export interface Loan {
  id: string;
  borrowerName: string;
  borrowerEmail: string;
  borrowerId: string;
  items: LoanItem[];
  status: LoanStatus;
  loanDate: string;
  dueDate: string;
  returnedDate?: string;
  notes?: string;
  labObservation?: string;
  returnedLate?: boolean;
  createdAt: string;
  updatedAt: string;
}
