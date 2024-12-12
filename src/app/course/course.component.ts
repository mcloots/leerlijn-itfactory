import { Component, Input } from '@angular/core';
import { Course } from '../course';

@Component({
  selector: 'app-course',
  imports: [],
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent {
  @Input() course!: Course;

}
