import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isLoggedIn.pipe(
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          // Check for specific roles if needed
          const requiredRoles = next.data['roles'] as Array<string>;
          if (requiredRoles) {
            return this.authService.role.pipe(
              map(userRole => {
                if (requiredRoles.includes(userRole)) {
                  return true;
                } else {
                  this.router.navigate(['/']);
                  return false;
                }
              })
            );
          }
          return of(true); // Use `of(true)` to return an observable with a `boolean` value
        } else {
          this.router.navigate(['/login']);
          return of(false); // Use `of(false)` to return an observable with a `boolean` value
        }
      })
    );
  }
}
