import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApplianceService {
  constructor(private http: HttpClient) {}

  getAllData(): Observable<any> {
    return this.http.get(`${environment.apiURL}/appliance/get-all`);
  }
}
