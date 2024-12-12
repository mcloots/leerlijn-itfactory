import { Component, HostListener, inject, OnInit } from '@angular/core';
import { Connection, Course } from '../course';
import { CourseService } from '../course.service';
import * as d3 from 'd3';
import { CourseComponent } from '../course/course.component';

@Component({
  selector: 'app-course-flowchart',
  imports: [CourseComponent],
  templateUrl: './course-flowchart.component.html',
  styleUrl: './course-flowchart.component.css'
})
export class CourseFlowchartComponent implements OnInit {
  courses: Course[] = [];
  private courseService = inject(CourseService);

  ngOnInit(): void {
    this.courseService.getConnections().subscribe(result => {
      this.fetchCourses(result);
    });

  }

  // HostListener to listen for the 'R' key press
  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'r' || event.key === 'R') { // 'r' or 'R' key is pressed
      this.resetFlowchart();
    }
  }

  // Function to reset flowchart (recreate it back to initial state)
  resetFlowchart() {
    this.ngOnInit();
  }

  fetchCourses(connections: Connection[]): void {
    this.courseService.getCourses()
      .subscribe(courses => {
        this.courses = courses;
      });
  }

  getCourses(phase: number, semester: number): Course[] {
    return this.courses.filter(course => course.phase === phase && course.semester === semester);
  }

}
