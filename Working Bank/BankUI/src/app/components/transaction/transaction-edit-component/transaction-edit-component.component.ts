import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Transaction } from 'src/app/models/transaction.model';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-transaction-edit',
  templateUrl: './transaction-edit-component.component.html',
  styleUrls: ['./transaction-edit-component.component.css']
})
export class TransactionEditComponent implements OnInit {
  transaction: Transaction = {
    id: 0,
    userId: '',
    payeeUserId: '',
    transactionType: '',
    amount: 0,
    date: new Date(),
    description: '',
    status: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.transactionService.getTransactionById(id).subscribe(
      (transaction: Transaction) => {
        this.transaction = transaction;
      },
      (error: any) => {
        console.error('Error fetching transaction:', error);
        alert(`Error fetching transaction: ${error.error.message || 'Unknown error'}`);
      }
    );
  }

  updateTransaction(): void {
    this.transactionService.updateTransaction(this.transaction).subscribe(
      () => {
        alert('Transaction updated successfully');
        this.router.navigate(['/admin-dashboard/transactions']);
      },
      (error: any) => {
        console.error('Error updating transaction:', error);
        alert(`Error updating transaction: ${error.error.message || 'Unknown error'}`);
      }
    );
  }
}
