import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  constructor(private http: HttpClient) {}

  analyzeTable(query: string) {
    const formData = new FormData();
    formData.append('query', query);

    return this.http.post<string>(
      `${environment.apiURL}/ai/analyze-data`,
      formData,
      {
        withCredentials: true,
      }
    );
  }
  chat(query: string) {
    const formData = new FormData();
    formData.append('query', query);

    return this.http.post<string>(`${environment.apiURL}/ai/chat`, formData, {
      withCredentials: true,
    });
  }
}
