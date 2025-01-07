import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) {}

  analyzeTable(table: any, query: string) {
    return this.http.post<string>(
      `${environment.apiURL}/chat/analyze-data`,
      { table, query },
      {
        withCredentials: true,
      }
    );
  }

  chat(query: string) {
    return this.http.post<string>(
      `${environment.apiURL}/chat/new`,
      { query },
      {
        withCredentials: true,
      }
    );
  }
}
