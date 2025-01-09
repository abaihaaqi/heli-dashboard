import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ReqAddUserAppliance } from '../model/user-appliance';

@Injectable({
  providedIn: 'root',
})
export class UserApplianceService {
  private baseURL = `${environment.apiURL}/user-appliance`;

  private userAppliancesByRoomSubject = new BehaviorSubject<any[]>([]);
  userAppliancesByRoom$ = this.userAppliancesByRoomSubject.asObservable();

  private roomsSubject = new BehaviorSubject<any[]>([]);
  rooms$ = this.roomsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllData(): Observable<any> {
    return this.http.get<any[]>(`${this.baseURL}/get-all`).pipe(
      tap((userAppliancesByRoom) => {
        this.roomsSubject.next(Object.keys(userAppliancesByRoom));
        this.userAppliancesByRoomSubject.next(userAppliancesByRoom);
      }),
      catchError((error) => {
        console.error('Error fetching user appliances:', error);
        return of([]);
      })
    );
  }

  getDataByID(id: any): Observable<any> {
    return this.http.get(`${this.baseURL}/get?id=${id}`);
  }

  addUserAppliance(data: ReqAddUserAppliance): Observable<any> {
    return this.http.post<any>(`${this.baseURL}/add`, data).pipe(
      tap((addedUserAppliance) => {
        const currentUserAppliances =
          this.userAppliancesByRoomSubject.getValue();
        let targetRoom = currentUserAppliances[addedUserAppliance.room];
        if (!targetRoom) {
          currentUserAppliances[addedUserAppliance.room] = [];
        }
        currentUserAppliances[addedUserAppliance.room].push(addedUserAppliance);
        this.userAppliancesByRoomSubject.next(currentUserAppliances);
        this.roomsSubject.next(Object.keys(currentUserAppliances));
      }),
      catchError((error) => {
        console.error('Error adding user appliance:', error);
        throw error;
      })
    );
  }

  updateUserAppliance(
    id: any,
    targetRoom: any,
    prevRoom: any
  ): Observable<any> {
    return this.http
      .put<any>(`${this.baseURL}/update`, { id: id, room: targetRoom })
      .pipe(
        tap((updatedUserAppliance) => {
          const currentUserAppliances =
            this.userAppliancesByRoomSubject.getValue();

          // Update previous room
          const prevRoomData = currentUserAppliances[prevRoom];
          const updatedPrevRoom = prevRoomData.filter(
            (userAppliance: any) => userAppliance.id != id
          );
          currentUserAppliances[prevRoom] = updatedPrevRoom;
          if (updatedPrevRoom.length == 0) {
            delete currentUserAppliances[prevRoom];
          }

          // Update target room
          const targetRoomData = currentUserAppliances[targetRoom];
          if (!targetRoomData) {
            currentUserAppliances[targetRoom] = [];
          }
          currentUserAppliances[targetRoom].push(updatedUserAppliance);

          this.userAppliancesByRoomSubject.next(currentUserAppliances);
          this.roomsSubject.next(Object.keys(currentUserAppliances));
        }),
        catchError((error) => {
          console.error('Error updating user appliance:', error);
          throw error;
        })
      );
  }

  updateCurrentStatus(updatedUserAppliance: any) {
    const currentUserAppliances = this.userAppliancesByRoomSubject.getValue();

    // Update previous room
    const roomData = currentUserAppliances[updatedUserAppliance.room];
    const index = roomData.findIndex(
      (userAppliance: any) => userAppliance.id == updatedUserAppliance.id
    );
    roomData[index].current_status = updatedUserAppliance.current_status;

    currentUserAppliances[updatedUserAppliance.room] = roomData;

    this.userAppliancesByRoomSubject.next(currentUserAppliances);
  }

  deleteUserAppliance(id: any, room: any): Observable<any> {
    return this.http.delete<void>(`${this.baseURL}/delete?id=${id}`).pipe(
      tap(() => {
        const currentUserAppliances =
          this.userAppliancesByRoomSubject.getValue();
        const targetRoom = currentUserAppliances[room];
        const updatedRoom = targetRoom.filter(
          (userAppliance: any) => userAppliance.id != id
        );
        currentUserAppliances[room] = updatedRoom;
        if (updatedRoom.length == 0) {
          delete currentUserAppliances[room];
        }
        this.userAppliancesByRoomSubject.next(currentUserAppliances);
        this.roomsSubject.next(Object.keys(currentUserAppliances));
      }),
      catchError((error) => {
        console.error('Error deleting user appliance:', error);
        throw error;
      })
    );
  }
}
