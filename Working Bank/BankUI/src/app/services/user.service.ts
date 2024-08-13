import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:5004/api/User'; // Adjust the API URL as per your backend
  private AdminUrl = 'http://localhost:5004/api/Admin';

  constructor(private http: HttpClient) { }

  getAllUsers() {
    return this.http.get<any[]>(`${this.baseUrl}/AllUsers`);
  }

  getUserById(userId: string) {
    return this.http.get<any>(`${this.baseUrl}/UserById/${userId}`);
  }

  createUser(user: any) {
    return this.http.post<any>(`${this.baseUrl}/AddUser`, user);
  }

  updateUser(user: any) {
    return this.http.put<any>(`${this.baseUrl}/UpdateUser`, user);
  }

  deleteUser(userId: string): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${userId}`, { responseType: 'text' });
  }
  

  approveUser(userId: string): Observable<any> {
    const url = `${this.AdminUrl}/Approve/${userId}`;
    return this.http.put(url, null, { responseType: 'text' }); // explicitly set responseType to 'text'
  }

  isUserApproved(userId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/IsUserApproved/${userId}`);
  }

  searchUsersByUserId(searchTerm: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/SearchUsersById/${searchTerm}`);
  }

  getPayeesByUserId(userId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/UserWithPayees/${userId}`);
  }
}
