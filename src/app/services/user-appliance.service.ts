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
    return this.http
      .get<any[]>(`${this.baseURL}/get-all`, {
        withCredentials: true,
      })
      .pipe(
        tap((userAppliancesByRoom) => {
          this.userAppliancesByRoomSubject.next(userAppliancesByRoom);
          this.roomsSubject.next(Object.keys(userAppliancesByRoom));
        }),
        catchError((error) => {
          console.error('Error fetching user appliances:', error);
          return of([]);
        })
      );
  }

  getDataByID(id: any): Observable<any> {
    return this.http.get(`${this.baseURL}/get?id=${id}`, {
      withCredentials: true,
    });
  }

  addUserAppliance(data: ReqAddUserAppliance): Observable<any> {
    return this.http
      .post<any>(`${this.baseURL}/add`, data, {
        withCredentials: true,
      })
      .pipe(
        tap((addedUserAppliance) => {
          const currentUserAppliances =
            this.userAppliancesByRoomSubject.getValue();
          const targetRoom = currentUserAppliances[addedUserAppliance.room];
          if (!targetRoom) {
            currentUserAppliances[addedUserAppliance.room] = [];
          }
          targetRoom.push(addedUserAppliance);
          this.userAppliancesByRoomSubject.next(currentUserAppliances);
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
      .put<any>(
        `${this.baseURL}/update`,
        { id: id, room: targetRoom },
        {
          withCredentials: true,
        }
      )
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

          // Update target room
          const targetRoomData = currentUserAppliances[targetRoom];
          targetRoomData.push(updatedUserAppliance);

          this.userAppliancesByRoomSubject.next(currentUserAppliances);
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
    return this.http
      .delete<void>(`${this.baseURL}/delete?id=${id}`, {
        withCredentials: true,
      })
      .pipe(
        tap(() => {
          const currentUserAppliances =
            this.userAppliancesByRoomSubject.getValue();
          const targetRoom = currentUserAppliances[room];
          const updatedRoom = targetRoom.filter(
            (userAppliance: any) => userAppliance.id != id
          );
          currentUserAppliances[room] = updatedRoom;
          this.userAppliancesByRoomSubject.next(currentUserAppliances);
        }),
        catchError((error) => {
          console.error('Error deleting user appliance:', error);
          throw error;
        })
      );
  }
}
