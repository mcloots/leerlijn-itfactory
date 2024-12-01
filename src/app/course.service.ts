import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Connection, Course } from './course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);

  apiUrl = `${environment.API_URL}`;

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses`);
  }

  getConnections(): Observable<Connection[]> {
    return this.http.get<Connection[]>(`${this.apiUrl}/connections`);
  }
}
