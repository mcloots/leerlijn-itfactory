import { Component, computed, EventEmitter, inject, Input, input, Output, signal } from '@angular/core';
import { Course, Tag } from '../course';
import { NgClass, NgStyle } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CourseDetailsModalComponent } from '../course-details-modal/course-details-modal.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-course',
  imports: [NgClass, NgStyle, MatIconModule],
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent {
  readonly course = input.required<Course>();
  readonly isHighlighted = input.required<boolean>();
  readonly isTagIncluded = input.required<boolean>();
  readonly isReused = input.required<boolean>();
  readonly selectedTag = input.required<Tag | null>();
  @Output() courseClick: EventEmitter<number> = new EventEmitter<number>();
  readonly dialog = inject(MatDialog);

  currentNgClass = computed(() => {
    if (this.isHighlighted()) { return 'bg-orange-700' };

    if (!this.course().phase_is_mandatory) {
      return 'bg-green-800'
    }
    return 'bg-gray-700';
  },
  );

  currentNgStyle = computed(() => {
    // if (this.isHighlighted()) { return { 'background-color': 'orange' } };
    if (this.isTagIncluded() && this.selectedTag()) {
      return { 'background-color': this.selectedTag()!.hex_color }
    };
    return {};
  },
  );

  onCourseClick() {
    this.courseClick.emit(this.course().learning_track_id);
  }

  openDetails(event: Event, course: any): void {
    event.stopPropagation();
    this.dialog.open(CourseDetailsModalComponent, {
      data: course,
      width: '90vw',
      height: '90vh',
      maxWidth: '100vw', // Prevent modal from being constrained by default maxWidth
      maxHeight: '100vh',
    });
  }

  setSelectedTagHighlight() {

  }
}
