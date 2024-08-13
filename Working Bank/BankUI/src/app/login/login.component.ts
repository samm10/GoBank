import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = this.fb.group({}); // Initialize with an empty FormGroup
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userId: ['', Validators.required],
      loginPassword: [
        '', 
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[\W_]).+$/) // At least 1 uppercase letter and 1 special character
        ]
      ]
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
      return;
    }

    this.authService.login(this.loginForm.value).subscribe(
      response => {
        console.log('Login successful');
      },
      error => {
        console.error('Login error', error);
        this.errorMessage = 'Login failed. Please check your credentials and try again.';
      }
    );
  }
}
