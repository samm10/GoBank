import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-create',
  templateUrl: './admin-create.component.html',
  styleUrls: ['./admin-create.component.css']
})
export class AdminCreateComponent {
  adminForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router
  ) {
    this.adminForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.adminForm.valid) {
      this.adminService.createAdmin(this.adminForm.value).subscribe(
        () => {
          alert('Admin created successfully');
          this.router.navigate(['/admin-dashboard/admins']);
        },
        (error) => {
          console.error('Error creating admin:', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }
}
