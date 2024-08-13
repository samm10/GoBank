import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list-component',
  templateUrl: './user-list-component.component.html',
  styleUrls: ['./user-list-component.component.css']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  searchControl = new FormControl();
  isAdmin: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.role.subscribe(role => {
      this.isAdmin = role === 'Admin';
      if (this.isAdmin) {
        this.loadUsers();
      } else {
        this.loadCurrentUser();
      }
    });

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(searchTerm => {
          // If searchTerm is empty, load all users
          return searchTerm.trim() === '' 
            ? this.isAdmin ? this.userService.getAllUsers() : this.userService.getUserById(this.authService.getUserId())
            : this.userService.searchUsersByUserId(searchTerm);
        })
      )
      .subscribe(
        (response: any) => this.users = response.$values || [response], // Handle both lists and single user responses
        (error: any) => console.error('Error fetching users:', error)
      );
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      (response: any) => {
        this.users = response.$values;
      },
      (error: any) => {
        console.error('Error fetching users:', error);
        alert(`Error fetching users: ${error.error.message || 'Unknown error'}`);
      }
    );
  }

  loadCurrentUser(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.userService.getUserById(userId).subscribe(
        user => {
          this.users = [user];
        },
        error => {
          console.error('Error fetching user:', error);
          alert(`Error fetching user: ${error.error.message || 'Unknown error'}`);
        }
      );
    }
  }

  viewUser(userId: string): void {
    if (this.isAdmin) {
      this.router.navigate(['/admin-dashboard/users', userId]);
    } else {
      this.router.navigate(['/user-dashboard/users', userId]);
    }
  }

  editUser(userId: string): void {
    if (this.isAdmin) {
      this.router.navigate(['/admin-dashboard/users', userId, 'edit']);
    } else {
      this.router.navigate(['/user-dashboard/users', userId, 'edit']);
    }
  }

  deleteUser(userId: string): void {
    if (this.isAdmin && confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe(
        (response: string) => {
          alert(response);
          this.loadUsers();
        },
        (error: any) => {
          console.error('Error deleting user:', error);
          alert(`Error deleting user: ${error.error.message || 'Unknown error'}`);
        }
      );
    } else if (!this.isAdmin) {
      alert('You do not have permission to delete users.');
    }
  }

  approveUser(userId: string): void {
    this.userService.approveUser(userId).subscribe(
      (response: string) => {
        alert(response);
        this.loadUsers();
      },
      (error: any) => {
        console.error('Error approving user:', error);
        alert(`Error approving user: ${error.error.message || 'Unknown error'}`);
      }
    );
  }
}
