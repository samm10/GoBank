import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Transaction } from 'src/app/models/transaction.model';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list-component.component.html',
  styleUrls: ['./transaction-list-component.component.css']
})
export class TransactionListComponent implements OnInit {
  searchTerm: string = '';
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  isAdmin: boolean = false;
  displayedColumns: string[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.role.subscribe(role => {
      this.isAdmin = role === 'Admin';
      this.displayedColumns = this.isAdmin 
        ? ['id', 'userId', 'payeeUserId', 'amount', 'date','transactionType', 'description', 'status', 'actions'] 
        : ['id', 'payeeUserId', 'amount', 'date', 'transactionType', 'description', 'status'];
      this.loadTransactions();
    });
  }

  loadTransactions(): void {
    if (this.isAdmin) {
      this.searchTerm ? this.searchUserTransactions() : this.loadAllTransactions();
    } else {
      this.loadUserTransactions();
    }
  }

  searchUserTransactions(): void {
    this.transactionService.getTransactionsByUserId(this.searchTerm).subscribe(
      (response: any) => {
        this.transactions = response.$values || response;
        this.filterTransactions();
      },
      error => {
        console.error('Error fetching transactions:', error);
      }
    );
  }

  loadUserTransactions(): void {
    const userId = this.authService.getUserId();
    this.transactionService.getTransactionsByUserId(userId).subscribe(
      (response: any) => {
        this.transactions = response.$values || response;
        this.filterTransactions();
      },
      error => {
        console.error('Error fetching transactions:', error);
      }
    );
  }

  loadAllTransactions(): void {
    this.transactionService.getAllTransactions().subscribe(
      (response: any) => {
        this.transactions = response.$values || response;
        this.filterTransactions();
      },
      error => {
        console.error('Error fetching transactions:', error);
      }
    );
  }

  filterTransactions(): void {
    let filtered = this.transactions;
  
    if (this.searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.userId.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  
    if (this.startDate && this.endDate) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        // Ensure startDate and endDate are valid before comparing
        return (!this.startDate || transactionDate >= this.startDate) &&
               (!this.endDate || transactionDate <= this.endDate);
      });
    }
  
    this.filteredTransactions = filtered;
  }
  

  deleteTransaction(id: number): void {
    this.transactionService.deleteTransaction(id).subscribe(
      () => {
        this.loadTransactions(); // Reload transactions after deletion
      },
      error => {
        console.error('Error deleting transaction:', error);
      }
    );
  }
}
