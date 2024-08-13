import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Account } from 'src/app/models/account.model';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list-component.component.html',
  styleUrls: ['./account-list-component.component.css']
})
export class AccountListComponent implements OnInit {
  accounts: Account[] = [];
  filteredAccounts: Account[] = [];
  searchTerm: string = '';
  userId: string = '';
  isAdmin: boolean = false;

  constructor(
    private accountService: AccountService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.role.subscribe(role => {
      this.isAdmin = role === 'Admin';
      this.userId = this.authService.getUserId();
      this.loadAccounts();
    });
  }

  loadAccounts(): void {
    if (this.isAdmin) {
      this.loadAllAccounts();
    } else {
      this.loadUserAccounts();
    }
  }

  loadUserAccounts(): void {
    this.accountService.getAccountByUserId(this.userId).subscribe(
      (response: any) => {
        this.accounts = response.$values || response || [];
        this.filteredAccounts = this.accounts;
      },
      error => {
        console.error('Error fetching user accounts:', error);
        // alert(`Error fetching user accounts: ${error}`);
      }
    );
  }

  loadAllAccounts(): void {
    this.accountService.getAccounts().subscribe(
      (response: any) => {
        this.accounts = response.$values || response || [];
        this.filteredAccounts = this.accounts;
      },
      error => {
        console.error('Error fetching all accounts:', error);
        alert(`Error fetching all accounts: ${error}`);
      }
    );
  }

  filterAccounts(): void {
    if (!this.searchTerm) {
      this.filteredAccounts = this.accounts;
    } else {
      this.filteredAccounts = this.accounts.filter(account =>
        account.userId.toLowerCase().startsWith(this.searchTerm.toLowerCase())
      );
    }
  }

  deleteAccountsByUserId(userId: string): void {
    if (confirm('Are you sure you want to delete these accounts?')) {
      this.accountService.deleteAccountsByUserId(userId).subscribe(
        (response: string) => {
          alert(response); // Show the API response text
          this.accounts = this.accounts.filter(account => account.userId !== userId);
          this.filteredAccounts = this.filteredAccounts.filter(account => account.userId !== userId);
        },
        error => {
          console.error('Error deleting accounts:', error);
          alert(`Error deleting accounts: ${error}`);
        }
      );
    }
  }
}
