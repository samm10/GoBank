import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-payee-create',
  templateUrl: './payee-create-component.component.html',
  styleUrls: ['./payee-create-component.component.css']
})
export class PayeeCreateComponent implements OnInit {
  payeeForm: FormGroup;
  apiUrl = 'http://localhost:5004/api/Payee/AddPayee';
  isAdmin: boolean = false;
  userId: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.payeeForm = this.fb.group({
      userId: [{ value: '', disabled: true }, Validators.required],
      payeeId: ['', Validators.required],
      name: ['', Validators.required],
      nickName: ['']
    });
  }

  ngOnInit(): void {
    this.authService.role.subscribe(role => {
      this.isAdmin = role === 'Admin';
    });

    this.userId = this.authService.getUserId();
    this.payeeForm.get('userId')?.setValue(this.userId);
  }

  onSubmit() {
    if (this.payeeForm.valid) {
      const payeeData = { ...this.payeeForm.value, userId: this.userId };
      this.http.post(this.apiUrl, payeeData, { responseType: 'text' })
        .subscribe({
          next: (response) => {
            alert('Payee added successfully');
            if (this.isAdmin) {
              this.router.navigate(['/admin-dashboard/payees']);
            } else {
              this.router.navigate(['/user-dashboard/payees']);
            }
          },
          error: (error) => {
            console.error('There was an error!', error);
            alert('Failed to add payee: ' + (error.error || error.message));
          }
        });
    }
  }
}
