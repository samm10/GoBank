import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Chart, registerables } from 'chart.js';
import { Transaction } from 'src/app/models/transaction.model';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {
  account: any = null;
  balance: number = 0;
  userId: string = '';
  transactions: Transaction[] = []; // Initialize transactions array

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    console.log('UserHomeComponent Initialized. User ID:', this.userId);

    if (this.userId) {
      this.accountService.getAccountByUserId(this.userId).subscribe(
        (account) => {
          console.log(account);
          this.account = account;
          this.balance = account.accountBalance;
          this.accountService.getTransactionsByUserId(this.userId).subscribe(
            (transactions) => {
              this.transactions = transactions; // Populate transactions array
              this.loadChart(); // Load the chart data
            },
            (error) => {
              console.error('Error loading transactions:', error);
            }
          );
        },
        (error) => {
          if (error.status === 404) {
            this.account = null;
          } else {
            console.error('Error loading account details:', error);
          }
        }
      );
    } else {
      console.error('User ID is undefined.');
    }
  }

  loadChart(): void {
    if (this.transactions.length === 0) {
      console.warn('No transactions available to display in chart.');
      return;
    }
  
    // Aggregate transaction counts per type
    const typeCounts = this.transactions.reduce((counts, tx) => {
      counts[tx.transactionType] = (counts[tx.transactionType] || 0) + 1;
      return counts;
    }, {} as { [key: string]: number });
  
    const labels = Object.keys(typeCounts);
    const data = Object.values(typeCounts);
  
    // Register Chart.js components
    Chart.register(...registerables);
  
    // Create the chart
    new Chart('transactionsChart', {
      type: 'pie', // Use pie chart
      data: {
        labels: labels,
        datasets: [{
          label: 'Transaction Type',
          data: data,
          backgroundColor: ['#3f51b5', '#f44336', '#4caf50', '#ffeb3b', '#9c27b0'], // Customize colors
          borderColor: '#fff',
          borderWidth: 2 // Increase border width for better visual separation
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                size: 14,
                family: 'Arial'
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                const label = tooltipItem.label || '';
                const value = tooltipItem.raw || 0;
                return `${label}: ${value} transactions`;
              }
            }
          }
        }
      }
    });
  }
  
  
  
  isTransactionInLastNdays(date: Date, days: number): boolean {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - days);
    return date >= targetDate;
  }
  

  navigateToAddAccount(): void {
    this.router.navigate(['/user-dashboard/add-account']);
  }

  addBalance(): void {
    const amount = prompt('Enter amount to add:');
    if (amount && !isNaN(Number(amount))) {
      this.accountService.addBalance(this.userId, Number(amount)).subscribe(
        () => {
          alert('Balance added successfully');
          this.ngOnInit(); // Reload the account details
        },
        (error) => {
          console.error('Error adding balance:', error);
        }
      );
    } else {
      alert('Invalid amount');
    }
  }
}
