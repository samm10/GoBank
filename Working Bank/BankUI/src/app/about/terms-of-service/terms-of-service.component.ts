import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-terms-of-service',
  templateUrl: './terms-of-service.component.html', // Adjust the template path as needed
  styleUrls: ['./terms-of-service.component.css'] // Adjust the style path as needed
})
export class TermsOfServiceComponent {
  constructor(private authService: AuthService, private router: Router) {}

  navigateHome() {
    if (this.authService.getRole() === 'Admin') {
      this.router.navigate(['/admin-dashboard']);
    } else {
      this.router.navigate(['/user-dashboard']);
    }
  }

  logout() {
    this.authService.logout();
  }
}
