import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Transaction } from 'src/app/models/transaction.model';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail-component.component.html',
  styleUrls: ['./transaction-detail-component.component.css']
})
export class TransactionDetailComponent implements OnInit {
  transaction: Transaction | undefined;
  displayedColumns: string[] = ['id', 'userId', 'payeeUserId', 'amount', 'date', 'description'];

  constructor(private route: ActivatedRoute, private transactionService: TransactionService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.transactionService.getTransactionById(id).subscribe(
      transaction => {
        this.transaction = transaction;
      },
      error => {
        console.error('Error fetching transaction:', error);
      }
    );
  }
}
