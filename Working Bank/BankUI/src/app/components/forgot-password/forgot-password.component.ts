import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  userId: string = '';
  oldPassword: string = '';
  newPassword: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  resetPassword() {
    if (this.userId && this.oldPassword && this.newPassword) {
      const resetPasswordRequest = {
        userId: this.userId,
        oldPassword: this.oldPassword,
        newPassword: this.newPassword
      };

      this.authService.resetLoginPassword(resetPasswordRequest).subscribe(
        response => {
          if (response === "Login password reset successfully") {
            this.successMessage = 'Login password reset successfully';
            this.errorMessage = '';
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 1000); // Navigate to login page after 3 seconds
          } else {
            this.errorMessage = response || 'Failed to reset login password';
            this.successMessage = '';
          }
        },
        error => {
          console.error('Password reset failed', error);
          this.errorMessage = 'Failed to reset login password';
          this.successMessage = '';
        }
      );
    } else {
      this.errorMessage = 'All fields are required.';
      this.successMessage = '';
    }
  }
}
