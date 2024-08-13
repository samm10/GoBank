export interface Transaction {
    id: number;
    userId: string;
    payeeUserId: string;
    transactionType: string;
    amount: number;
    date: Date;
    description: string;
    status: string;
  }
  