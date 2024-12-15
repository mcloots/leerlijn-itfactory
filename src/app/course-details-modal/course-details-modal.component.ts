import { Component, Inject } from '@angular/core';
import { Course } from '../course';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-course-details-modal',
  imports: [],
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
