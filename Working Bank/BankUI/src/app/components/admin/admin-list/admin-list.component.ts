import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { Admin } from 'src/app/models/admin.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.css']
})
export class AdminListComponent implements OnInit {
  admins: Admin[] = [];

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.adminService.getAllAdmins().subscribe(
      (admins) => {
        this.admins = admins;
      },
      (error) => {
        console.error('Error loading admins:', error);
      }
    );
  }

  deleteAdmin(adminId: string | undefined): void {
    if (adminId) {
      if (confirm('Are you sure you want to delete this admin?')) {
        this.adminService.deleteAdmin(adminId).subscribe(
          () => {
            this.loadAdmins(); // Reload admins after deletion
            alert('Admin deleted successfully');
          },
          (error) => {
            console.error('Error deleting admin:', error);
          }
        );
      }
    } else {
      console.error('Admin ID is undefined');
    }
  }

  editAdmin(admin: Admin): void {
    // Remove password before navigating
    const { password, ...adminWithoutPassword } = admin;
    this.router.navigate(['/admin-dashboard/admins/edit', admin.adminid], { state: { admin: adminWithoutPassword } });
  }
}
