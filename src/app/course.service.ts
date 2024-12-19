import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { Course, Tag } from './course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);

  apiUrl = `${environment.API_URL}`;

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>('/assets/db.json').pipe(
      map((data: any) => data.courses)  // Extract the 'courses' array from the response
    );
    //return this.http.get<Course[]>(`${this.apiUrl}/courses`);
  }

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>('/assets/db.json').pipe(
      map((data: any) => data.tags)  // Extract the 'courses' array from the response
    );
    //return this.http.get<Tag[]>(`${this.apiUrl}/tags`);
  }
}
