import { Component, HostListener, inject, Input, OnInit, signal } from '@angular/core';
import { Course, Tag } from '../course';
import { CourseService } from '../course.service';
import { CourseComponent } from '../course/course.component';
import { FooterComponent } from "../footer/footer.component";
import { map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course-flowchart',
  imports: [CourseComponent, FooterComponent],
  templateUrl: './course-flowchart.component.html',
  styleUrl: './course-flowchart.component.css'
})
export class CourseFlowchartComponent implements OnInit {
  courses: Course[] = [];
  usedTags: string[] = [];
  private courseService = inject(CourseService);
  selectedLearningTrackId = 0;
  selectedTag = signal<Tag | null>(null);
  @Input() learning_track_id: number = 0;
  @Input() isReused: boolean = false;
  @Input() programmeSelected: string = '';
  @Input() selectedCourse: string = '';
  private route = inject(ActivatedRoute);

  // @Input()
  // set programme(programme: string) {
  //   if (!this.isReused) {
  //     this.fetchCourses(programme, null);
  //   }
  // }

  ngOnInit(): void {
    const programme = this.route.snapshot.paramMap.get('programme');

    if (this.isReused) {
      this.fetchCourses(this.programmeSelected, this.learning_track_id);
    } else if (programme) {
      this.fetchCourses(programme, null);
    }
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

  fetchCourses(programme: string, learning_track_id: number | null): void {
    if (!learning_track_id) {
      this.courseService.getCourses()
        .pipe(
          map(courses => courses.filter(course =>
            course.programme.toUpperCase().includes('ALL') || course.programme.toUpperCase().includes(programme.toUpperCase())
          ))
        )
        .subscribe(courses => {
          console.log(this.courses);
          this.courses = courses;
          this.usedTags = this.getDistinctTagsFromCourses(courses);
        });
    } else {
      this.courseService.getCourses()
        .pipe(
          map(courses => courses.filter(course =>
            course.learning_track_id === learning_track_id
          ))
        )
        .subscribe(courses => {
          console.log(this.courses);
          this.courses = courses;
          this.usedTags = this.getDistinctTagsFromCourses(courses);
        });
    }
  }

  getCourses(phase: number, semester: number): Course[] {
    return this.courses.filter(course => course.phase === phase && course.semester === semester);
  }

  getDistinctTagsFromCourses(courses: Course[]): string[] {
    return ([...new Set(courses.flatMap(course => course.tags))]);
  }

  onCourseClicked(learningTrackId: number) {
    this.selectedTag.set(null);
    this.selectedLearningTrackId =
      this.selectedLearningTrackId === learningTrackId
        ? 0
        : learningTrackId;
  }

  isCourseHighlighted(learningTrackId: number, z_code: string): boolean {
    if (this.selectedCourse) {
      return (this.selectedCourse === z_code);
    }

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
