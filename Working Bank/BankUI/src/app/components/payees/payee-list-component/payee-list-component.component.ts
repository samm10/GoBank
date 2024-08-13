import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Payee } from 'src/app/models/payee.model';
import { PayeeService } from 'src/app/services/payee.service';

@Component({
  selector: 'app-payee-list',
  templateUrl: './payee-list-component.component.html',
  styleUrls: ['./payee-list-component.component.css']
})
export class PayeeListComponent implements OnInit {
  payees: Payee[] = [];
  filteredPayees: Payee[] = [];
  userId: string = '';
  isAdmin: boolean = false;
  searchTerm: string = '';

  constructor(
    private payeeService: PayeeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.role.subscribe(role => {
      this.isAdmin = role === 'Admin';
      this.userId = this.authService.getUserId();
      this.loadPayees();
    });
  }

  loadPayees(): void {
    if (this.isAdmin) {
      this.loadAllPayees();
    } else {
      this.loadUserPayees();
    }
  }

  loadUserPayees(): void {
    this.payeeService.getPayeeByUserId(this.userId).subscribe(
      (response: any) => {
        this.payees = response.$values || response || [];
        this.filteredPayees = this.payees;
      },
      error => {
        console.error('Error fetching payees:', error);
      }
    );
  }

  loadAllPayees(): void {
    this.payeeService.getAllPayees().subscribe(
      (response: any) => {
        this.payees = response.$values || response || [];
        this.filteredPayees = this.payees;
      },
      error => {
        console.error('Error fetching payees:', error);
      }
    );
  }

  filterPayees(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredPayees = this.payees.filter(payee => 
      payee.userId.toLowerCase().includes(searchTermLower) ||
      payee.payeeUserId.toLowerCase().includes(searchTermLower)
    );
  }

  deletePayee(payeeId: string): void {
    if (!payeeId) {
      console.error('Payee ID is missing');
      alert('Invalid Payee ID');
      return;
    }
  
    this.payeeService.deletePayee(payeeId).subscribe(
      () => {
        this.payees = this.payees.filter(payee => payee.payeeUserId !== payeeId);
        this.filterPayees(); // Reapply filter after deletion
        alert('Payee deleted successfully');
        if (this.isAdmin) {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/user-dashboard']);
        }
      },
      error => {
        console.error('Error deleting payee:', error);
        alert('Payee deleted successfully');
        if (this.isAdmin) {
          this.router.navigate(['/admin-dashboard/payees']);
        } else {
          this.router.navigate(['/user-dashboard/payees']);
        }
        
      }
    );
  }

  editPayee(payee: Payee): void {
    if (this.isAdmin) {
      this.router.navigate(['/admin-dashboard/payees/edit'], { state: { payee } });
    } else {
      this.router.navigate(['/user-dashboard/payees/edit'], { state: { payee } });
    }
  }

  AddPayee(): void {
    // Navigate to add payee page
    if (this.isAdmin) {
      this.router.navigate(['/admin-dashboard/payees/create']);
    } else {
      this.router.navigate(['/user-dashboard/payees/create']);
    }
  }
}
