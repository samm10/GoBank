import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { Account } from 'src/app/models/account.model';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit-component.component.html',
  styleUrls: ['./account-edit-component.component.css']
})
export class AccountEditComponent implements OnInit {
  accountForm: FormGroup;
  userId!: string;
  isAdmin!: boolean;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.accountForm = this.fb.group({
      userId: [{ value: '', disabled: true }],  // Disable the userId field
      ifsc: [{ value: '', disabled: true }],    // Disable the ifsc field
      branchName: ['', Validators.required],
      accountType: ['', Validators.required],
      addressLine: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      accountBalance: [{ value: 0, disabled: true }],  // Disable the balance field
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId') || '';
      this.loadAccount();
    });
  }

  loadAccount(): void {
    this.accountService.getAccountByUserId(this.userId).subscribe(
      (account: Account) => {
        this.accountForm.patchValue(account);
      },
      error => {
        console.error('Error fetching account details:', error);
        alert('Failed to fetch account details.');
      }
    );
  }

  onSubmit(): void {
    if (this.accountForm.valid) {
      // Create an updated account object without the disabled fields
      const updatedAccount = {
        ...this.accountForm.value,
        ifsc: undefined,       // Exclude IFSC from update
        accountBalance: undefined // Exclude balance from update
      } as Account;

      this.accountService.updateAccount(updatedAccount).subscribe(
        () => {
          alert('Account updated successfully');
          this.router.navigate(['/admin-dashboard/accounts']); // or redirect to a relevant page
        },
        error => {
          console.error('Error updating account:', error);
          alert('Failed to update account.');
        }
      );
    }
  }
}
