import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-forgot-username',
  templateUrl: './forgot-username.component.html',
  styleUrls: ['./forgot-username.component.css']
})
export class ForgotUsernameComponent {
  email: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  retrieveUsername() {
    if (this.email) {
      this.authService.requestUsernameRetrieval(this.email).subscribe(
        response => {
          this.successMessage = `Your username is ${response.username}.`;
          this.email = ''; // Clear email field after success
        },
        error => {
          console.error('Username retrieval failed', error);
          this.errorMessage = 'An error occurred. Please try again later.';
        }
      );
    } else {
      this.errorMessage = 'Email address is required.';
    }
  }
}
