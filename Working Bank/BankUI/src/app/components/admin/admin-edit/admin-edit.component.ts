import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.css']
})
export class AdminEditComponent implements OnInit {
  adminForm: FormGroup;
  adminId: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService
  ) {
    this.adminForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.minLength(6)] // Apply minimum length validation for password
    });
  }

  ngOnInit(): void {
    const admin = history.state.admin;
    if (admin) {
      this.adminId = admin.adminid;
      this.adminForm.patchValue({
        name: admin.name,
        email: admin.email,
      });
      this.fetchAdminDetails(this.adminId);
    } else {
      console.error('No admin data found in state');
    }
  }

  fetchAdminDetails(adminId: string): void {
    this.adminService.getAdminById(adminId).subscribe(
      (admin) => {
        this.adminForm.patchValue({
          name: admin.name,
          email: admin.email,
          password: admin.password // Set the password in the form
        });
      },
      (error) => {
        console.error('Error fetching admin details:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.adminForm.valid) {
      const formValue = this.adminForm.value;
      const payload = { ...formValue };
      if (!formValue.password) {
        delete payload.password;
      }
      
      this.adminService.updateAdmin(this.adminId, payload).subscribe(
        () => {
          alert('Admin updated successfully');
          this.router.navigate(['/admin-dashboard/admins']);
        },
        (error) => {
          console.error('Error updating admin:', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }
}
