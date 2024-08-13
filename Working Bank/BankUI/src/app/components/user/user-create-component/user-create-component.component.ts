import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-create-component',
  templateUrl: './user-create-component.component.html',
  styleUrls: ['./user-create-component.component.css']
})
export class UserCreateComponent implements OnInit {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18)]],
      gender: ['', Validators.required],
      accountType: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  createUser() {
    if (this.userForm.valid) {
      this.userService.createUser(this.userForm.value).subscribe(
        (response: any) => {
          alert(`Registration Successful!\nUser ID: ${response.userId}\nName: ${response.name}\nEmail: ${response.email}`);
          this.router.navigate(['/admin-dashboard/users']);
        },
        error => {
          console.error('Error creating user:', error);
          alert('Error creating user. Please try again.');
        }
      );
    } else {
      alert('Please correct the errors in the form before submitting.');
    }
  }
}
