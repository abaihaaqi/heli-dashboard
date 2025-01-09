import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { RequestLogin, RequestRegister } from 'src/app/model/auth';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser$: Observable<any>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  register(data: RequestRegister) {
    return this.http.post<any>(`${environment.apiURL}/auth/register`, data);
  }

  login(data: RequestLogin): Observable<any> {
    return this.http.post<any>(`${environment.apiURL}/auth/login`, data).pipe(
      map((response) => {
        const sessionToken = response.session_token;
        localStorage.setItem('session_token', response.session_token);
        const arrayToken = sessionToken.split('.');
        const tokenPayload = JSON.parse(atob(arrayToken[1]));
        this.currentUserSubject.next(tokenPayload);
        return response;
      })
    );
  }

  autologin(): Observable<any> {
    return this.http.get<any>(`${environment.apiURL}/auth/autologin`).pipe(
      map((response) => {
        const sessionToken = localStorage.getItem('session_token');
        if (sessionToken) {
          const arrayToken = sessionToken.split('.');
          const tokenPayload = JSON.parse(atob(arrayToken[1]));
          this.currentUserSubject.next(tokenPayload);
          return response;
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.get<any>(`${environment.apiURL}/auth/logout`).pipe(
      map((response) => {
        console.log(response);
        localStorage.removeItem('session_token');
        this.currentUserSubject.next(null);
      })
    );
  }
}
