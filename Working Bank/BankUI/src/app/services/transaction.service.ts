import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:5004/api/Transaction';

  constructor(private http: HttpClient) {}


  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/AllTransactions`);
  }

  getTransactionsByUserId(userId: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/TransactionsByUserId/${userId}`)
      .pipe(catchError(this.handleError));
  }

  getTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/TransactionById/${id}`)
      .pipe(catchError(this.handleError));
  }

  updateTransaction(transaction: Transaction): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/UpdateTransaction`, transaction)
      .pipe(catchError(this.handleError));
  }

  deleteTransaction(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/DeleteTransaction/${id}`)
      .pipe(catchError(this.handleError));
  }

  checkUserAccountExists(userId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/CheckUserAccountExists/${userId}`).pipe(
      catchError(() => of(false))
    );
  }

  checkPayeeAccountExists(payeeUserId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/CheckPayeeAccountExists/${payeeUserId}`).pipe(
      catchError(() => of(false))
    );
  }

  checkSufficientBalance(userId: string, amount: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/CheckSufficientBalance/${userId}/${amount}`).pipe(
      catchError(() => of(false))
    );
  }

  addTransaction(transaction: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/AddTransaction`, transaction).pipe(
      catchError(() => of(null))
    );
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