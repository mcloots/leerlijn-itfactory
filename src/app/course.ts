// src/app/models/course.model.ts
export interface Course {
  z_code: string;
  course_name: string;
  phase: number;
  phase_is_mandatory: boolean;
  semester: number;
  learning_contents: string;
  learning_track_id: number;
  objectives: string[];
  tags: string[]
}

export interface Semester {
  semesterNumber: number;
  courses: Course[];
}

export interface Phase {
  phaseNumber: number;
  semesters: Semester[];
}

export interface Tag {
  name: string;
  hex_color: string;
}

