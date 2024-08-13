import { Component } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-credit-balance',
  templateUrl: './credit-balance.component.html',
  styleUrls: ['./credit-balance.component.css']
})
export class CreditBalanceComponent {
  userId: string = '';
  amount: number = 0;

  constructor(private accountService: AccountService) { }

  creditBalance(): void {
    if (this.userId && this.amount > 0) {
      this.accountService.addBalance(this.userId, this.amount).subscribe(
        (response: any) => {
          if (response.status === 200) {
            alert('Balance added successfully');
          } else {
            alert('Failed to add balance. Please try again.');
          }
        },
        error => {
          console.error('Error adding balance:', error);
          alert('Failed to add balance. Please try again.');
        }
      );
    } else {
      alert('Please enter a valid User ID and amount.');
    }
  }  
}
