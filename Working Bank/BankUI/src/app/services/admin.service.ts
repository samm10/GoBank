import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Admin } from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:5004/api/Admin';

  constructor(private http: HttpClient) {}

  getAllAdmins(): Observable<Admin[]> {
    return this.http.get<{ $values: Admin[] }>(`${this.apiUrl}/GetAllAdmins`).pipe(
      map(response => response.$values),  // Extract the $values array
      catchError((error) => {
        console.error('Error fetching admins:', error);
        return of([]);  // Return an empty array on error
      })
    );
  }

  // Endpoint to get an admin by ID
  getAdminById(id: string): Observable<Admin> {
    return this.http.get<Admin>(`${this.apiUrl}/ViewAdmin/${id}`);
  }

  // Endpoint to create a new admin
  createAdmin(admin: Admin): Observable<Admin> {
    return this.http.post<Admin>(`${this.apiUrl}/Register`, admin);
  }

  // Endpoint to update an admin
  updateAdmin(id: string, admin: Admin): Observable<Admin> {
    return this.http.put<Admin>(`${this.apiUrl}/UpdateAdmin/${id}`, admin);
  }

  deleteAdmin(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Delete/${id}`);
  }
}
