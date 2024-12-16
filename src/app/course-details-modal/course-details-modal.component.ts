import { Component, forwardRef, Inject } from '@angular/core';
import { Course } from '../course';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { SemesterPipe } from "../semester.pipe";
import { CourseFlowchartComponent } from "../course-flowchart/course-flowchart.component";

@Component({
  selector: 'app-course-details-modal',
  imports: [MatIconModule, SemesterPipe, forwardRef(() => CourseFlowchartComponent)],
  templateUrl: './course-details-modal.component.html',
  styleUrl: './course-details-modal.component.css'
})
export class CourseDetailsModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public course: Course,
    private dialogRef: MatDialogRef<CourseDetailsModalComponent>
  ) { }

  onClose(): void {
    this.dialogRef.close();
  }
}
