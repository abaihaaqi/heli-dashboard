import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { RequestLogin, RequestRegister } from 'src/app/model/auth';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser$: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('current_user') || 'null')
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  register(data: RequestRegister) {
    return this.http.post<any>(`${environment.apiURL}/auth/register`, data);
  }

  login(data: RequestLogin): Observable<any> {
    return this.http
      .post<any>(`${environment.apiURL}/auth/login`, data, {
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          response.expires_at = new Date(response.expires_at).toISOString();
          localStorage.setItem('current_user', JSON.stringify(response));
          this.currentUserSubject.next(response);
          return response;
        })
      );
  }

  logout(): Observable<any> {
    return this.http
      .get<any>(`${environment.apiURL}/auth/logout`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          console.log(response);
          localStorage.removeItem('current_user');
          this.currentUserSubject.next(null);
        })
      );
  }
}
