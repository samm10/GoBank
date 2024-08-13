import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-account-create',
  templateUrl: './account-create-component.component.html',
  styleUrls: ['./account-create-component.component.css']
})
export class AccountCreateComponent implements OnInit {
  accountForm: FormGroup;
  isAdmin: boolean = false;
  userId: string = '';

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private userService: UserService,
    private router: Router,
    private authService: AuthService
  ) {
    this.accountForm = this.fb.group({
      userId: [{ value: '', disabled: true }, Validators.required],
      ifsc: [{ value: 'MYBK000123987', disabled: true }, [Validators.required, Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],
      branchName: [{ value: 'Belapur Thane Road Airoli', disabled: true }, Validators.required],
      accountType: ['', Validators.required],
      addressLine: [{ value: 'Belapur Thane Road Airoli', disabled: true }, Validators.required],
      city: [{ value: 'Navi Mumbai', disabled: true }, Validators.required],
      state: [{ value: 'Maharashtra', disabled: true }, Validators.required],
      postalCode: [{ value: '452018', disabled: true }, [Validators.required, Validators.pattern(/^\d{5,6}$/)]]
    });

    this.authService.role.subscribe(role => {
      this.isAdmin = role === 'Admin';
    });

    this.userId = this.authService.getUserId();
  }

  ngOnInit(): void {
    this.accountForm.patchValue({ userId: this.userId });
  }

  onSubmit(): void {
    if (this.accountForm.valid) {
      const userId = this.userId;

      this.userService.isUserApproved(userId).subscribe(
        (isApproved: boolean) => {
          if (isApproved) {
            const accountData = { ...this.accountForm.getRawValue(), userId };

            this.accountService.addAccount(accountData).subscribe(
              (response: string) => {
                console.log('Account creation response:', response);
                alert(response); // Show the response text from API
                if (this.isAdmin) {
                  this.router.navigate(['/admin-dashboard/accounts']);
                } else {
                  this.router.navigate(['/user-dashboard/home']);
                }
              },
              (error: any) => {
                console.error('Error creating account:', error);
                alert('User is not approved. Please contact the admin.');
                if (this.isAdmin) {
                  this.router.navigate(['/admin-dashboard/accounts']);
                } else {
                  this.router.navigate(['/user-dashboard/home']);
                }
              }
            );
          } else {
            alert('User is not approved. Please contact the admin.');
          }
        },
        error => {
          console.error('Error checking user approval status:', error);
          alert('Error checking user approval status. Please try again later.');
        }
      );
    }
  }
}
