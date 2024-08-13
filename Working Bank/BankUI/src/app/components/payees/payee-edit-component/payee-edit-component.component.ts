import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PayeeService } from 'src/app/services/payee.service';
import { Payee } from 'src/app/models/payee.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-payee-edit',
  templateUrl: './payee-edit-component.component.html',
  styleUrls: ['./payee-edit-component.component.css']
})
export class PayeeEditComponent implements OnInit {
  payeeForm: FormGroup;
  payee: Payee | null = null;
  userRole: string = '';

  constructor(
    private fb: FormBuilder,
    private payeeService: PayeeService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) {
    this.payeeForm = this.fb.group({
      payeeId: [{ value: '', disabled: true }, Validators.required],
      userId: [{ value: '', disabled: true }, Validators.required],
      name: ['', Validators.required],
      accountNumber: ['', Validators.required],
      nickName: ['']
    });
  }

  ngOnInit(): void {
    this.userRole = this.authService.getRole();
    
    

    const state = history.state;
    if (state && state.payee) {
      this.payee = state.payee;
      if (this.payee) {
        this.patchFormValues(this.payee);
      }
    } else {
      const payeeId = this.route.snapshot.paramMap.get('payeeId');
      if (payeeId) {
        this.payeeService.getPayeeByUserId(payeeId).subscribe(
          payee => {
            this.payee = payee;
            if (this.payee) {
              this.patchFormValues(this.payee);
            }
          },
          error => {
            console.error('Error fetching payee:', error);
          }
        );
      }
    }
  }

  patchFormValues(payee: Payee): void {
    this.payeeForm.patchValue({
      payeeId: payee.payeeUserId, // Mapping payeeUserId to payeeId
      userId: payee.userId,
      name: payee.name,
      accountNumber: payee.accountNumber,
      nickName: payee.nickName
    });
  }

  onSubmit(): void {
    if (this.payeeForm.valid) {
      this.payeeService.updatePayee(this.payeeForm.getRawValue()).subscribe(
        () => {
          if (this.userRole == "Admin") {
            this.router.navigate(['/admin-dashboard/payees']);
          } else {
            this.router.navigate(['/user-dashboard/payees']);
          }
        },
        error => {
          console.error('Error updating payee:', error);
        }
      );
    }
  }
}
