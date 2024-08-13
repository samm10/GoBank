import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from 'src/app/services/transaction.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/auth/auth.service'; // Import AuthService
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction-create',
  templateUrl: './transaction-create-component.component.html',
  styleUrls: ['./transaction-create-component.component.css']
})
export class TransactionCreateComponent implements OnInit {
  transactionForm!: FormGroup;
  payees: any[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  fetchUserId: string = '';

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private userService: UserService,
    private authService: AuthService, // Inject AuthService
    private router: Router
  ) {}

  ngOnInit() {
    this.transactionForm = this.fb.group({
      userId: [{ value: '', disabled: true }, Validators.required],
      payeeUserId: ['', Validators.required],
      transactionType: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      date: [this.getCurrentDate(), Validators.required], // Auto-fill date
      description: ['']
    });

    // Automatically fill the userId and fetch payees
    const loggedInUserId = this.authService.getUserId(); // Fetch logged-in user ID
    this.fetchUserId = loggedInUserId;
    this.transactionForm.patchValue({ userId: loggedInUserId });

    if (loggedInUserId) {
      this.userService.getPayeesByUserId(loggedInUserId).subscribe(
        (response: any) => {
          this.payees = response.$values || []; // Handle response correctly
        },
        error => {
          console.error('Error fetching payees:', error);
          this.errorMessage = 'Error fetching payees. Please try again later.';
        }
      );
    }
  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  }

  onSubmit() {
    if (this.transactionForm.invalid) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const transaction = this.transactionForm.value;
    transaction.userId = this.fetchUserId;

    this.transactionService.checkUserAccountExists(this.fetchUserId).subscribe(userExists => {
      if (!userExists) {
        this.errorMessage = 'User account does not exist.';
        return;
      }

      this.transactionService.checkPayeeAccountExists(transaction.payeeUserId).subscribe(payeeExists => {
        if (!payeeExists) {
          this.errorMessage = 'Payee account does not exist.';
          return;
        }

        this.transactionService.checkSufficientBalance(this.fetchUserId, transaction.amount).subscribe(sufficient => {
          if (!sufficient) {
            this.errorMessage = 'Insufficient balance.';
            this.successMessage = 'null';
            alert('Insufficient balance.');
          }

          else{
            this.successMessage = 'Transaction successful!';
            this.errorMessage = null;
          }

          this.transactionService.addTransaction(transaction).subscribe(response => {
            
            
            // Navigate based on user role
            const userRole = this.authService.getRole();
            if (userRole === 'Admin') {
              this.router.navigate(['/admin-dashboard/transactions']);
            } else {
              this.router.navigate(['/user-dashboard/transactions']);
            }
          }, error => {
            this.errorMessage = 'Transaction failed.';
          });
        });
      });
    });
  }
}