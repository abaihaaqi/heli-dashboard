import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {
    this.authService.autologin().subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        localStorage.removeItem('session_token');
      },
    });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const sessionToken = localStorage.getItem('session_token');
    const currentUser = this.authService.currentUserValue;

    if (!sessionToken || !currentUser) {
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }
    const now = Date.now();
    const expires = currentUser.exp * 1000;

    if (expires < now) {
      localStorage.removeItem('current_user');
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }

    // logged in so return true
    return true;
  }
}
