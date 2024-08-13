import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Account } from '../models/account.model';
import { Transaction } from '../models/transaction.model';


@Injectable({
  providedIn: 'root'
})
export class AccountService {
    
  private apiUrl = 'http://localhost:5004/api/Account';
  private transactionApiUrl = 'http://localhost:5004/api/Transaction'; 

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/AllAccounts`)
      .pipe(catchError(this.handleError));
  }


  getTransactionsByUserId(userId: string): Observable<Transaction[]> {
    return this.http.get<any>(`${this.transactionApiUrl}/TransactionsByUserId/${userId}`).pipe(
      map(response => response.$values as Transaction[]), // Map to correct structure
      catchError(this.handleError)
    );
  }
  

  getAccountByUserId(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }

  addBalance(userId: string, amount: number): Observable<any> {
    const url = `${this.apiUrl}/AddBalance`;
    const body = { userId, amount };
    return this.http.post(url, body).pipe(
      catchError(this.handleBalError<any>('addBalance'))
    );
  }

  addAccount(account: Account): Observable<string> {
    return this.http.post(this.apiUrl + '/AddAccount', account, { responseType: 'text' });
  }
  
  updateAccount(account: Account): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/UpdateAccount`, account)
      .pipe(catchError(this.handleError));
  }

  deleteAccountsByUserId(userId: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/DeleteAccount/${userId}`, { responseType: 'text' as 'json' })
      .pipe(
        catchError(this.handleBalError<string>('deleteAccountsByUserId', 'Error deleting accounts'))
      );
  }

  private handleBalError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
