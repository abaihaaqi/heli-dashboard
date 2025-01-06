import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ReqAddConsumption } from '../model/consumption';

@Injectable({
  providedIn: 'root',
})
export class ConsumptionService {
  private baseURL = `${environment.apiURL}/consumption`;

  private consumptionsSubject = new BehaviorSubject<any[]>([]);
  consumptions$ = this.consumptionsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllData(): Observable<any> {
    return this.http
      .get<any[]>(`${this.baseURL}/get-all`, {
        withCredentials: true,
      })
      .pipe(
        tap((consumptions) => {
          this.consumptionsSubject.next(consumptions);
        }),
        catchError((error) => {
          console.error('Error fetching consumptions:', error);
          return of([]);
        })
      );
  }

  addConsumption(data: ReqAddConsumption): Observable<any> {
    return this.http
      .post(`${this.baseURL}/add`, data, {
        withCredentials: true,
      })
      .pipe(
        tap((addedConsumption) => {
          const currentConsumptions = this.consumptionsSubject.getValue();
          this.consumptionsSubject.next([
            addedConsumption,
            ...currentConsumptions,
          ]);
        }),
        catchError((error) => {
          console.error('Error adding consumption:', error);
          throw error;
        })
      );
  }

  resetConsumptions(): Observable<any> {
    return this.http
      .delete<void>(`${this.baseURL}/reset`, {
        withCredentials: true,
      })
      .pipe(
        tap(() => {
          this.consumptionsSubject.next([]);
        }),
        catchError((error) => {
          console.error('Error deleting user appliance:', error);
          throw error;
        })
      );
  }
}
