import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  private excludedUrls: string[] = [
    `${environment.apiURL}/auth/login`,
    `${environment.apiURL}/auth/register`,
  ];

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Check if the request URL matches any excluded URLs
    const isExcluded = this.excludedUrls.some((url) => req.url.includes(url));

    if (isExcluded) {
      // If the URL is excluded, pass the request without modifying it
      return next.handle(req);
    }

    // Otherwise, add the Authorization header
    const token = localStorage.getItem('session_token'); // Replace with your token logic
    const authReq = token
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        })
      : req;

    return next.handle(authReq);
  }
}
