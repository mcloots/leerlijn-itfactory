import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { Course, Tag } from '../course';
import { CourseService } from '../course.service';
import * as d3 from 'd3';
import { CourseComponent } from '../course/course.component';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-course-flowchart',
  imports: [CourseComponent, FooterComponent],
  templateUrl: './course-flowchart.component.html',
  styleUrl: './course-flowchart.component.css'
})
export class CourseFlowchartComponent implements OnInit {
  courses: Course[] = [];
  private courseService = inject(CourseService);
  selectedLearningTrackId = 0;
  selectedTag = signal<Tag | null>(null);

  ngOnInit(): void {
    this.fetchCourses();
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

  fetchCourses(): void {
    this.courseService.getCourses()
      .subscribe(courses => {
        this.courses = courses;
      });
  }

  getCourses(phase: number, semester: number): Course[] {
    return this.courses.filter(course => course.phase === phase && course.semester === semester);
  }

  onCourseClicked(learningTrackId: number) {
    this.selectedTag.set(null);
    this.selectedLearningTrackId =
      this.selectedLearningTrackId === learningTrackId
        ? 0
        : learningTrackId;
  }

  isCourseHighlighted(learningTrackId: number): boolean {
    return (
      this.selectedLearningTrackId > 0 &&
      this.selectedLearningTrackId === learningTrackId
    );
  }

  isTagIncluded(tags: string[]): boolean {
    if (this.selectedTag()) {
      return (
        tags.includes(this.selectedTag()!.name)
      );
    } else {
      return false;
    }
  }

  onTagClicked(tag: Tag | null) {
    if (tag) {
      this.selectedLearningTrackId = 0;
      this.selectedTag.set(tag);
    } else {
      this.selectedTag.set(null);
    }
  }

}
