import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Payee } from '../models/payee.model';

@Injectable({
  providedIn: 'root'
})
export class PayeeService {
  private apiUrl = 'http://localhost:5004/api/Payee'; // Adjust URL based on your API

  constructor(private http: HttpClient) {}

  getPayeeByUserId(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetPayees/${userId}`);
  }

  getPayeesByPayeeId(payeeId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Payee/${payeeId}`);
  }

  getAllPayees(): Observable<Payee[]> {
    return this.http.get<Payee[]>(`${this.apiUrl}/GetAllPayees`);
  }

  addPayee(payee: Payee): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/AddPayee`, payee, { responseType: 'text' as 'json' });
  }

  updatePayee(payee: { userId: string; payeeUserId: string; name: string; nickName: string; }): Observable<string> {
    return this.http.put(this.apiUrl + '/UpdatePayee', payee, { responseType: 'text' });
  }

  deletePayee(payeeId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/DeletePayee/${payeeId}`)
      .pipe(catchError(this.handleError));
  }
  
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    // Handle the error here (e.g., log it to the console)
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }
  
}
