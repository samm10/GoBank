import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private userRole = new BehaviorSubject<string>('');
  private userId: string = ''; 

  constructor(private http: HttpClient, private router: Router) {
    // Retrieve userId and token from localStorage on service initialization
    this.userId = localStorage.getItem('userId') || '';
    console.log('AuthService Initialized. userId:', this.userId); // Debug log
    const token = localStorage.getItem('token');
    if (token) {
      this.loggedIn.next(true);
      this.userRole.next(this.getRoleFromToken(token));
    }
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  get role() {
    return this.userRole.asObservable();
  }

  getUserId(): string {
    console.log('getUserId called. userId:', this.userId); // Debug log
    return this.userId;
  }

  getRole(): string {
    return this.userRole.value;
  }

  login(user: { userId: string, loginPassword: string }) {
    return this.http.post<any>('http://localhost:5004/api/UserCredentials/login', user).pipe(
      map(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.user.userId); // Store userId from response.user.userId
        this.userId = response.user.userId; // Update userId in service variable
        console.log('Login successful. userId:', this.userId); // Debug log
        this.loggedIn.next(true);
        this.userRole.next(this.getRoleFromToken(response.token));
        if (this.userRole.value === 'Admin') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/user-dashboard']);
        }
      }),
      catchError(error => {
        console.error('Login failed', error);
        return throwError(error);
      })
    );
  }

  signup(user: any) {
    return this.http.post<any>('http://localhost:5004/api/User/AddUser', user);
  }

  getRoleFromToken(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload); // Print the entire payload to the console
      const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
      return payload[roleClaim] || '';
    } catch (e) {
      console.error('Error decoding token:', e);
      return '';
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId'); // Remove userId from localStorage on logout
    this.userId = ''; // Clear the service variable
    this.loggedIn.next(false);
    this.userRole.next('');
    this.router.navigate(['/login']);
  }

  resetLoginPassword(resetPasswordRequest: any) {
    return this.http.put('http://localhost:5004/api/User/ResetLoginPassword', resetPasswordRequest, { responseType: 'text' });
  }
  

  requestUsernameRetrieval(email: string) {
    return this.http.post<any>('http://localhost:5004/api/userCredentials/forgot-username', { email });
  }
}
