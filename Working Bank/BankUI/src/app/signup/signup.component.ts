import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  userId: string = '';
  email: string = '';
  loginPassword: string = '';
  name: string = '';
  phoneNumber: string = ''; // Changed to string for better input validation
  age: number = 0;
  gender: string = '';
  accountType: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  signup() {
    const user = {
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      age: this.age,
      gender: this.gender,
      password: this.loginPassword,
      accountType: this.accountType
    };
    
    this.authService.signup(user).subscribe(
      response => {
        console.log('Signup successful');
        this.showSuccessDialog(response);
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Signup failed', error);
        if (error.status === 400) {
          this.errorMessage = 'User already exists';
        } else {
          this.errorMessage = 'An error occurred during signup. Please try again later.';
        }
      }
    );
  }

  showSuccessDialog(response: any) {
    alert(`Registration Successful!\nUser ID: ${response.userId}\nName: ${response.name}\nEmail: ${response.email}`);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
