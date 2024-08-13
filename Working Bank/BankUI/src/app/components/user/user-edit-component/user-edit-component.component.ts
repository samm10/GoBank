import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-edit-component',
  templateUrl: './user-edit-component.component.html',
  styleUrls: ['./user-edit-component.component.css']
})
export class UserEditComponent implements OnInit {
  user: any = {};

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const userId = params.get('userId');
      if (userId) {
        this.loadUser(userId);
      }
    });
  }

  loadUser(userId: string) {
    this.userService.getUserById(userId).subscribe(
      data => {
        this.user = data;
      },
      error => {
        console.error('Error fetching user:', error);
      }
    );
  }

  updateUser() {
    this.userService.updateUser(this.user).subscribe(
      () => {
        alert('User updated successfully');
        this.router.navigate(['/admin-dashboard/users']);
      },
      error => {
        console.error('Error updating user:', error);
      }
    );
  }
}
